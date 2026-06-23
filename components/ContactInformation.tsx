import { Mail, Phone, MapPin, Camera, Users, Briefcase, Play } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaXTwitter
} from "react-icons/fa6";
import SubstackIcon from "./substact";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    content: "info@reclaimhope.rw",
    href: "mailto:info@reclaimhope.rw"
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+250 788 123 456",
    href: "tel:+250788123456"
  },
  {
    icon: MapPin,
    title: "Address",
    content: "Nyamirambo, Kigali, Rwanda",
    href: "#"
  },
  {
    icon: FaInstagram,
    title: "Instagram",
    content: "@reclaimhope_rw",
    href: "Instagram:https://www.instagram.com/reclaimhoperwanda/"
  },
  {
    icon: FaFacebook,
    title: "Facebook",
    content: "Reclaim Hope Rwanda",
    href: "https://www.facebook.com/profile.php?id=61589336073208"
  },
  {
    icon: SubstackIcon,
    title: "Substack",
    content: "Reclaim Hope",
    href: "https://substack.com/@reclaimhope?utm_source=global-search"
  }
];

export default function ContactInformation() {
  return (
    <section className="w-full py-24 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactInfo.map((item, index) => {
            const Icon = item.icon 
            const delayClass = index === 0 ? 'animate-stagger-reveal' :
              index === 1 ? 'animate-stagger-reveal-delay-1' :
                index === 2 ? 'animate-stagger-reveal-delay-2' :
                  'animate-stagger-reveal-delay-3';
            return (
              <a
                key={item.title}
                href={item.href}
                className={`bg-gray-50 hover:bg-gray-100 transition-all duration-300 rounded-2xl p-6 text-center group ${delayClass}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-8 h-8 text-[#001f3f]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.content}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}