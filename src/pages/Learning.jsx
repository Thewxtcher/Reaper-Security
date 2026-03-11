import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Code, BookOpen, Wrench, Award, Youtube, Monitor, FolderOpen,
  ExternalLink, Search, BookMarked
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const topics = [
  { icon: Globe, title: 'Level 0 - Networking Basics', description: 'Start here! Learn networking fundamentals', color: 'text-blue-400', bgColor: 'bg-blue-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: Code, title: 'Programming', description: 'Programming languages for security', color: 'text-purple-400', bgColor: 'bg-purple-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: BookOpen, title: 'Hacking Books', description: 'Essential reading materials', color: 'text-pink-400', bgColor: 'bg-pink-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: Wrench, title: 'Real World Pentest', description: 'Practical penetration testing', color: 'text-red-400', bgColor: 'bg-red-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: Wrench, title: 'Tools', description: 'Security tools and utilities', color: 'text-orange-400', bgColor: 'bg-orange-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: Award, title: 'Free Certification Info', description: 'Certification prep resources', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: Globe, title: 'Websites for Learning', description: 'Curated learning platforms', color: 'text-green-400', bgColor: 'bg-green-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: Youtube, title: 'YouTube Channels', description: 'Video tutorials and courses', color: 'text-red-400', bgColor: 'bg-red-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: Monitor, title: 'Virtualization Software', description: 'VM setup and configuration', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
  { icon: FolderOpen, title: "SKY's Educational Folder", description: 'Community contributed content', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', url: 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link' },
];

const categories = ['All', 'Pentesting', 'Network', 'Web Security', 'OSINT', 'Certifications', 'CTF'];

export default function Learning() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const driveUrl = 'https://drive.google.com/drive/folders/1PV_jxVP0BeUe1nzGa5FfePnU7p7lYvTE?usp=drive_link';

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold font-serif text-white mb-6">Learning Center</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Free resources to start your cybersecurity journey. 40GB+ of curated content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Drive */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-blue-500/20">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif text-xl">Mr. J's Security Learning Drive</h3>
                    <p className="text-gray-400 text-sm">
                      Access 40GB+ of free cybersecurity learning materials including books, courses, tools, and more.
                    </p>
                  </div>
                </div>
                <a href={driveUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Drive
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Browse by Topic */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-serif text-white mb-8">Browse by Topic</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topics.map((topic, index) => (
              <motion.a
                key={topic.title}
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Card className="bg-[#111] border border-white/5 hover:border-white/20 transition-all h-full">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-lg ${topic.bgColor} flex items-center justify-center mb-3`}>
                      <topic.icon className={`w-5 h-5 ${topic.color}`} />
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1 group-hover:text-gray-300 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-gray-500 text-xs">{topic.description}</p>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Resources */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-serif text-white mb-8">Curated Resources</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#111] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="bg-[#111] border border-white/10">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Card className="bg-[#111] border border-white/10">
            <CardContent className="p-12 text-center">
              <BookMarked className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No resources found. Check out the Google Drive above!</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bootcamp CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-purple-500/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold font-serif text-white mb-2">
                Cyber Bootcamp (43.74 GB)
              </h3>
              <p className="text-gray-400 mb-6">
                Complete cybersecurity bootcamp with comprehensive learning materials. Available in the drive.
              </p>
              <a href={driveUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600">
                  Access Bootcamp
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}