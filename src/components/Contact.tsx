import React from "react";
import { Phone, Mail, Users, Instagram, Youtube, Facebook } from "lucide-react";

const Contact: React.FC = () => {
  const contacts = [
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: "WhatsApp",
      link: "https://wa.me/9226221871",
      text: "9226221871",
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-500" />,
      title: "E-mail",
      link: "mailto:vikkitembhurne358@gmail.com",
      text: "vikkitembhurne358@gmail.com",
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "WhatsApp Group",
      link: "https://chat.whatsapp.com/KYAuVuPVR8xJ8eXbTLvDl3",
      text: "chat.whatsapp.com/KYAuVuPVR8xJ8eXbTLvDl3",
    },
    {
      icon: <Instagram className="w-6 h-6 text-pink-500" />,
      title: "Instagram",
      link: "https://www.instagram.com/artistic.vicky/",
      text: "www.instagram.com/artistic.vicky/",
    },
    {
      icon: <Youtube className="w-6 h-6 text-red-600" />,
      title: "YouTube",
      link: "https://www.youtube.com/@artisticvicky",
      text: "www.youtube.com/@artisticvicky",
    },
    {
      icon: <Facebook className="w-6 h-6 text-blue-600" />,
      title: "Facebook",
      link: "https://www.facebook.com/mayur.tembhurne.148",
      text: "www.facebook.com/mayur.tembhurne.148",
    },
  ];

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col justify-center items-center bg-purple-50 px-6 py-20"
    >
      <h2 className="text-4xl font-extrabold text-purple-800 mb-12 text-center">
        Connect with Vicky 🎨
      </h2>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {contacts.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md border border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            {item.icon}
            <div>
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-purple-700 text-sm break-all">{item.text}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact;
