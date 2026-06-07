import EzraImg from '../../assests/images/ezrapfp.jpg'
import EdenImg from '../../assests/images/edenpfp.png'
import JenImg from '../../assests/images/jenpfp.jpg'

export default function AboutPage() {
  const team = [
    {
      name: 'Ezra de Laborde',
      image: EzraImg,
      blurb: `I'm into MX, Snowboarding, Skating and Gaming. I have 2 cats. I enjoy spending time in nature but I also love to read. I chose The Home Library as a project because as someone who collects obscure books you don't typically find at the local library, the idea of opening my 'Home Library' for others who also enjoy my niche topics and subjects.`,
    },
    {
      name: 'Eden',
      image: EdenImg,
      blurb: `I am interested in music production, painting, occultism and spirituality. I enjoy spending time with friends, gaming and deep diving niche topics. I am not particularly a big reader myself, however the reason I chose to participate in The Home Library project was to challenge myself in the development, and to learn more about the books and interests of my cohort (and hopefully in the future, others too!)`,
    },
    {
      name: 'Jen Anderson',
      image: JenImg,
      blurb: ` I have a background in information management and the GLAM sector. I'm learning coding because I'm interested in data structures, process design, and information access and retrieval. 
      Three things about me:
I am a connoisseur of incidental details.
I keep a personal leaderboard of the most obscure songs I've Shazamed. The current champion has been Shazamed by only three other people.
I am a perpetual student and usually have several unrelated topics on the go at once.`,
    },
    {
      name: 'Brannan',
      image: '/images/branna.jpg',
      blurb: 'aboutme4',
    },
  ]

  return (
    <div className="about-page">
      <main className="max-w-app mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Meet the Team</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-surface border border-border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={member.image}
                alt={`${member.name}'s portrait`}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
              <p className="text-text-muted, blurb">{member.blurb}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
