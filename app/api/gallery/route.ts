import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

export async function GET() {
  const PHOTO_FILES = [
    'wedding1.jpg',
    'KakaoTalk_20260928_161605_kksaxi.jpg',
    'wedding1.jpg',
    'wedding1.jpg',
    'wedding1.jpg',
    'wedding1.jpg',
    'wedding1.jpg',
    'wedding1.jpg',
    'wedding1.jpg',
    'KakaoTalk_20260928_161605_kksaxi.jpg',
  ]

  const urls = PHOTO_FILES.map((filename) =>
    cloudinary.url(filename, { secure: true })
  )

  return NextResponse.json(urls)
}
