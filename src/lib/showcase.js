import { supabase } from './supabase'

export const SHOWCASE_BUCKET = 'site-showcase-images'
export const SHOWCASE_TABLE = 'site_showcase_projects'

export async function fetchShowcaseProjects() {
  const { data, error } = await supabase
    .from(SHOWCASE_TABLE)
    .select('slug, name, category, description, tech, goals, features, image_path, image_alt')

  if (error) throw error

  return Object.fromEntries((data || []).map(project => {
    const isAdminUpload = /(?:^|\/)uploads\//.test(project.image_path)
    return [project.slug, {
      name: project.name,
      cat: project.category,
      desc: project.description,
      tech: project.tech,
      goals: project.goals,
      features: project.features,
      ...(isAdminUpload && {
        image: supabase.storage.from(SHOWCASE_BUCKET).getPublicUrl(project.image_path).data.publicUrl,
        imageAlt: project.image_alt,
      }),
    }]
  }))
}

export async function uploadShowcaseProjectImage(project, file) {
  const allowedTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  const extension = allowedTypes[file.type]

  if (!extension) {
    throw new Error('Choose a JPG, PNG, or WebP image.')
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('The image must be 5 MB or smaller.')
  }

  const imagePath = `${project.slug}/uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`
  const { error: uploadError } = await supabase.storage
    .from(SHOWCASE_BUCKET)
    .upload(imagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    throw new Error(`Could not upload the image: ${uploadError.message}`)
  }

  const { data: previousProject, error: lookupError } = await supabase
    .from(SHOWCASE_TABLE)
    .select('image_path')
    .eq('slug', project.slug)
    .maybeSingle()

  if (lookupError) {
    const { error: cleanupError } = await supabase.storage.from(SHOWCASE_BUCKET).remove([imagePath])
    if (cleanupError) {
      throw new Error(`Could not check the existing project: ${lookupError.message}. The uploaded image also could not be cleaned up: ${cleanupError.message}`)
    }
    throw new Error(`Image uploaded, but the existing project could not be checked: ${lookupError.message}`)
  }

  const { error: saveError } = await supabase
    .from(SHOWCASE_TABLE)
    .upsert({
      slug: project.slug,
      name: project.name,
      category: project.cat,
      description: project.desc,
      tech: project.tech,
      goals: project.goals,
      features: project.features,
      image_path: imagePath,
      image_alt: `${project.name} category screenshot`,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' })

  if (saveError) {
    const { error: cleanupError } = await supabase.storage.from(SHOWCASE_BUCKET).remove([imagePath])
    if (cleanupError) {
      throw new Error(`Could not save the project record: ${saveError.message}. The uploaded image also could not be cleaned up: ${cleanupError.message}`)
    }
    throw new Error(`Could not save the project record: ${saveError.message}`)
  }

  if (previousProject?.image_path && previousProject.image_path !== imagePath) {
    const { error: removeError } = await supabase.storage
      .from(SHOWCASE_BUCKET)
      .remove([previousProject.image_path])
    if (removeError) {
      console.warn(`Updated project image, but could not remove the previous image: ${removeError.message}`)
    }
  }

  return supabase.storage.from(SHOWCASE_BUCKET).getPublicUrl(imagePath).data.publicUrl
}
