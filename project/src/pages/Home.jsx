import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

function Home() {
  const featuredWriters = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
      bio: "Award-winning author of 'The Last Sunset' and 'Midnight Dreams'",
      achievements: ["Monthly Winner", "Editor's Choice"],
      story: {
        title: "The Last Sunset",
        excerpt: "In the dying light of day, she realized everything was about to change...",
        rating: 4.8,
        votes: 1243
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      bio: "Bestselling thriller writer with a passion for suspense",
      achievements: ["Top Rated", "Rising Star"],
      story: {
        title: "The Silent Witness",
        excerpt: "The evidence was there, hidden in plain sight all along...",
        rating: 4.9,
        votes: 892
      }
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      bio: "Romance novelist and two-time Story of the Month winner",
      achievements: ["Story of the Month", "Community Favorite"],
      story: {
        title: "Love in Paris",
        excerpt: "The city of lights held more magic than she ever imagined...",
        rating: 4.7,
        votes: 756
      }
    }
  ];

  return (
    <div className="bg-classic-cream min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#1A202C 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-premium-text mb-6 tracking-tight leading-tight">
                Transform Your Stories <br />
                <span className="text-transparent bg-clip-text bg-gold-gradient italic">Into Screen Magic</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="w-24 h-1 bg-classic-gold mx-auto mb-8"></div>
              <p className="mt-4 text-xl text-classic-slate max-w-2xl mx-auto leading-relaxed font-light">
                Share your stories, get discovered by the industry, and turn your narratives into visual entertainment.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link
                to="/write"
                className="btn-primary w-full sm:w-auto"
              >
                Start Writing
              </Link>
              <Link
                to="/stories"
                className="btn-secondary w-full sm:w-auto"
              >
                Browse Stories
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold font-serif text-premium-text mb-4">Why Choose Narrata?</h2>
            <div className="w-24 h-1 bg-gold-gradient mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card group">
              <div className="text-4xl mb-6 bg-teal-50 w-16 h-16 rounded-xl flex items-center justify-center text-premium-gold shadow-sm group-hover:scale-110 group-hover:bg-teal-100 transition-all duration-300">📝</div>
              <h3 className="text-xl font-bold text-premium-text font-serif mb-3">Share Your Stories</h3>
              <p className="text-premium-slate leading-relaxed">Write and share your stories with a global audience of readers and industry professionals.</p>
            </div>

            <div className="card group">
              <div className="text-4xl mb-6 bg-teal-50 w-16 h-16 rounded-xl flex items-center justify-center text-premium-gold shadow-sm group-hover:scale-110 group-hover:bg-teal-100 transition-all duration-300">🏆</div>
              <h3 className="text-xl font-bold text-premium-text font-serif mb-3">Get Recognized</h3>
              <p className="text-premium-slate leading-relaxed">Climb the leaderboard and get featured on our platform as top storytellers.</p>
            </div>

            <div className="card group">
              <div className="text-4xl mb-6 bg-teal-50 w-16 h-16 rounded-xl flex items-center justify-center text-premium-gold shadow-sm group-hover:scale-110 group-hover:bg-teal-100 transition-all duration-300">🎬</div>
              <h3 className="text-xl font-bold text-premium-text font-serif mb-3">Industry Connection</h3>
              <p className="text-premium-slate leading-relaxed">Connect with production houses and turn your stories into visual entertainment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Writers Section */}
      <div className="py-20 bg-classic-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif text-classic-navy mb-4">Featured Writers</h2>
            <div className="w-16 h-1 bg-classic-gold mx-auto mb-4"></div>
            <p className="text-lg text-classic-slate">Meet our most accomplished storytellers</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {featuredWriters.map((writer) => (
              <div key={writer.id} className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-8 text-center">
                  <div className="mx-auto w-32 h-32 mb-6">
                    <img
                      src={writer.image}
                      alt={writer.name}
                      className="w-full h-full rounded-full object-cover ring-4 ring-classic-cream shadow-md"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {writer.achievements.map((achievement, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-classic-navy text-classic-gold"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-2xl font-bold text-classic-navy font-serif mb-2">{writer.name}</h3>
                  <p className="text-classic-slate italic mb-6 text-sm">{writer.bio}</p>

                  <div className="mt-6 p-6 bg-classic-cream rounded-sm border border-gray-100 text-left">
                    <h4 className="font-bold text-classic-navy font-serif text-lg mb-2">{writer.story.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 font-serif">{writer.story.excerpt}</p>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <div className="flex items-center">
                        <span className="text-classic-gold">★</span>
                        <span className="ml-1 text-sm font-bold text-classic-navy">{writer.story.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({writer.story.votes})</span>
                      </div>
                      <Link
                        to={`/story/${writer.id}`}
                        className="text-sm font-bold text-classic-navy hover:text-classic-gold transition-colors uppercase tracking-wide"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif text-classic-navy mb-4">Contact Us</h2>
            <div className="w-16 h-1 bg-classic-gold mx-auto mb-4"></div>
            <p className="text-lg text-classic-slate">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card bg-classic-cream border-none">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-classic-navy uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-classic-navy focus:ring-classic-navy bg-white p-3"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-classic-navy uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-classic-navy focus:ring-classic-navy bg-white p-3"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-classic-navy uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-classic-navy focus:ring-classic-navy bg-white p-3"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-col justify-center space-y-8 p-8">
              <div>
                <h3 className="text-2xl font-bold text-classic-navy font-serif mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-classic-cream flex items-center justify-center text-classic-navy group-hover:bg-classic-navy group-hover:text-classic-gold transition-colors">
                      <EnvelopeIcon className="h-5 w-5" />
                    </div>
                    <span className="ml-4 text-classic-slate text-lg">contact@storytoscreen.com</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-classic-cream flex items-center justify-center text-classic-navy group-hover:bg-classic-navy group-hover:text-classic-gold transition-colors">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <span className="ml-4 text-classic-slate text-lg">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-classic-cream flex items-center justify-center text-classic-navy group-hover:bg-classic-navy group-hover:text-classic-gold transition-colors">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <span className="ml-4 text-classic-slate text-lg">123 Story Street, Creative City, ST 12345</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-classic-navy font-serif mb-4">Office Hours</h3>
                <div className="text-classic-slate space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;



