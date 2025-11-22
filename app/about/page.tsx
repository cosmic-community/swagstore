import { getAboutPage } from '@/lib/cosmic'
import { AboutPage } from '@/types'

export default async function About() {
  const aboutData = await getAboutPage()
  const about = aboutData as AboutPage | null

  // Default content if no Cosmic data is available
  const pageTitle = about?.metadata?.page_title || 'About Us'
  const heroImage = about?.metadata?.hero_image?.imgix_url
  const introduction = about?.metadata?.introduction || 'Welcome to SwagStore'
  const storyTitle = about?.metadata?.story_title || 'Our Story'
  const storyContent = about?.metadata?.story_content || ''
  const missionStatement = about?.metadata?.mission_statement || ''
  const values = about?.metadata?.values || []
  const teamImage = about?.metadata?.team_image?.imgix_url

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
        style={heroImage ? {
          backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.8), rgba(30, 64, 175, 0.8)), url(${heroImage}?w=2000&h=800&fit=crop&auto=format,compress)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {pageTitle}
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
              {introduction}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      {storyContent && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">{storyTitle}</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              {storyContent.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission Statement Section */}
      {missionStatement && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
            <p className="text-xl text-gray-700 text-center leading-relaxed">
              {missionStatement}
            </p>
          </div>
        </section>
      )}

      {/* Values Section */}
      {values.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-3 text-blue-600">
                    {value.title}
                  </h3>
                  <p className="text-gray-700">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Image Section */}
      {teamImage && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src={`${teamImage}?w=2400&h=1200&fit=crop&auto=format,compress`}
                alt="Our Team"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Explore our collection of premium branded merchandise
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  )
}