// Mock image upload function
export async function uploadImage(file: File): Promise<string> {
  // In a real implementation, this would upload to your server or cloud storage
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Create a FileReader to read the file
        const reader = new FileReader()

        reader.onload = () => {
          // In a real app, you'd return the URL from your server/storage
          // For this mock, we'll just return a placeholder or the data URL

          // Randomly select a placeholder image for demo purposes
          const placeholders = [
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop",
          ]

          const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)]
          resolve(randomPlaceholder)
        }

        reader.onerror = () => {
          reject(new Error("Failed to read file"))
        }

        reader.readAsDataURL(file)
      } catch (error) {
        reject(error)
      }
    }, 1500) // Simulate 1.5s upload time
  })
}
