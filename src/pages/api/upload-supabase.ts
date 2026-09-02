import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: false,
  },
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
const bucket = process.env.SUPABASE_BUCKET || 'uploads'

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if(!supabase) return res.status(500).json({ error: 'Supabase not configured on server' })

  const form = new formidable.IncomingForm({ keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if(err){
      console.error('Upload error', err)
      return res.status(500).json({ error: 'Upload failed' })
    }

    const file = (files as any).file
    if(!file) return res.status(400).json({ error: 'No file uploaded' })

    const filepath = file.filepath || file.path
    const stream = fs.createReadStream(filepath)
    const filename = `${Date.now()}-${file.originalFilename || file.name}`.replace(/[^a-z0-9.\-_.]/ig, '')
    try{
      const { data, error } = await supabase.storage.from(bucket).upload(filename, stream, { cacheControl: '3600', upsert: false })
      if(error){
        console.error('Supabase upload error', error)
        return res.status(500).json({ error: 'Supabase upload failed' })
      }

      const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl
      return res.status(200).json({ fileUrl: publicUrl })
    }catch(e){
      console.error(e)
      return res.status(500).json({ error: 'Upload failed' })
    }
  })
}
