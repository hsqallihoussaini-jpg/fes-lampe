import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { type File as FormidableFile } from 'formidable'
import fs from 'fs'
import { getSupabaseServerClient } from '../../lib/supabaseServer'

export const config = {
  api: {
    bodyParser: false,
  },
}

const bucket = process.env.SUPABASE_BUCKET || 'uploads'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return res.status(500).json({
      error: 'Supabase not configured on server',
    })
  }

  const form = formidable({
    keepExtensions: true,
    multiples: false,
  })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err)
      return res.status(500).json({
        error: 'Upload failed',
      })
    }

    const file: FormidableFile | undefined = Array.isArray(files.file)
      ? files.file[0]
      : files.file

    if (!file) {
      return res.status(400).json({
        error: 'No file uploaded',
      })
    }

    try {
      const filepath = file.filepath

      if (!filepath) {
        return res.status(400).json({
          error: 'File path not found',
        })
      }

      const fileBuffer = fs.readFileSync(filepath)

      const originalName = file.originalFilename || 'image'
      const extension = originalName.includes('.')
        ? originalName.substring(originalName.lastIndexOf('.'))
        : ''

      const filename = `${Date.now()}${extension}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, fileBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype || 'application/octet-stream',
        })

      if (error) {
        console.error('Supabase upload error:', error)

        return res.status(500).json({
          error: error.message,
        })
      }

      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return res.status(200).json({
        fileUrl: publicData.publicUrl,
      })
    } catch (error: any) {
      console.error('Upload error:', error)

      return res.status(500).json({
        error: error?.message || 'Upload failed',
      })
    }
  })
}