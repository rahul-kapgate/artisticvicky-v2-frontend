import React from "react";
import {
  SiWhatsapp,
  SiInstagram,
  SiFacebook,
  SiYoutube,
} from "react-icons/si";
import { MdEmail, MdGroups } from "react-icons/md"; 

const Contact: React.FC = () => {
  const contacts = [
    {
      icon: <SiWhatsapp className="w-6 h-6 text-green-600" />,
      title: "WhatsApp",
      link: "https://wa.me/9325217691",
      text: "9325217691",
    },
    {
      icon: <MdEmail className="w-6 h-6 text-blue-500" />,
      title: "E-mail",
      link: "mailto:vikkitembhurne358@gmail.com",
      text: "vikkitembhurne358@gmail.com",
    },
    {
      icon: <MdGroups className="w-6 h-6 text-green-600" />,
      title: "WhatsApp Group",
      link: "https://chat.whatsapp.com/H7MmQmlgJ5W2KgvIRKqZc7?mode=wwt",
      text: "chat.whatsapp.com/KYAuVuPVR8xJ8eXbTLvDl3",
    },
    {
      icon: <SiInstagram className="w-6 h-6 text-pink-500" />,
      title: "Instagram",
      link: "https://www.instagram.com/artistic.Vickey/",
      text: "www.instagram.com/artistic.Vickey/",
    },
    {
      icon: <SiYoutube className="w-6 h-6 text-red-600" />,
      title: "YouTube",
      link: "https://www.youtube.com/@artisticVickey",
      text: "www.youtube.com/@artisticVickey",
    },
    {
      icon: <SiFacebook className="w-6 h-6 text-blue-600" />,
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
        Connect with Vickey 🎨
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
