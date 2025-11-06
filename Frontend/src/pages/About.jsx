import React from 'react';
import { Card, Button, Badge } from 'flowbite-react';
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  Heart, 
  Globe, 
  BookOpen,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'Founder & Editor-in-Chief',
      bio: 'Former tech journalist with a passion for storytelling',
      image: '/team/sarah.jpg',
      expertise: ['Technology', 'Leadership'],
      posts: 45
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Senior Editor',
      bio: 'Award-winning writer with 10+ years experience',
      image: '/team/marcus.jpg',
      expertise: ['Business', 'Lifestyle'],
      posts: 89
    },
    {
      name: 'Priya Patel',
      role: 'Community Manager',
      bio: 'Building engaged communities around meaningful content',
      image: '/team/priya.jpg',
      expertise: ['Community', 'Social Media'],
      posts: 23
    },
    {
      name: 'Alex Thompson',
      role: 'Content Strategist',
      bio: 'Data-driven approach to content that resonates',
      image: '/team/alex.jpg',
      expertise: ['Strategy', 'Analytics'],
      posts: 34
    }
  ];

  const stats = [
    { number: '50K+', label: 'Monthly Readers', icon: Eye },
    { number: '500+', label: 'Published Articles', icon: BookOpen },
    { number: '50+', label: 'Expert Writers', icon: Users },
    { number: '15+', label: 'Countries Reached', icon: Globe }
  ];

  const values = [
    {
      icon: Sparkles,
      title: 'Quality Over Quantity',
      description: 'Every piece of content is carefully crafted and reviewed to ensure it meets our high standards.'
    },
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize building meaningful connections with our readers and writers.'
    },
    {
      icon: Zap,
      title: 'Innovation Driven',
      description: 'We embrace new technologies and storytelling methods to enhance the reading experience.'
    },
    {
      icon: Target,
      title: 'Impact Focused',
      description: 'Our goal is to create content that makes a difference in people\'s lives.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Platform Launch', description: 'Started with 10 dedicated writers' },
    { year: '2021', event: '10K Readers', description: 'Reached our first major milestone' },
    { year: '2022', event: 'Mobile App Launch', description: 'Expanded to mobile platforms' },
    { year: '2023', event: 'Award Winning', description: 'Recognized for excellence in digital publishing' },
    { year: '2024', event: 'Global Community', description: 'Expanded to international markets' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <Badge color="purple" className="mx-auto">
              <Sparkles size={14} className="mr-1" />
              Our Story
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              More Than Just{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Words
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              We're a passionate community of storytellers, thinkers, and innovators 
              dedicated to sharing ideas that inspire, educate, and connect people worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button gradientDuoTone="purpleToBlue" size="lg" className="flex items-center gap-2">
                Join Our Community
                <ArrowRight size={16} />
              </Button>
              <Button color="light" size="lg" className="flex items-center gap-2">
                Meet the Team
                <Users size={16} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <Badge color="blue">
                <Target size={14} className="mr-1" />
                Our Mission
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Empowering Voices, 
                <span className="text-blue-600"> Inspiring Change</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                We believe everyone has a story worth telling. Our platform provides the tools, 
                community, and visibility needed for diverse voices to be heard and make an impact.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Create a space where quality content thrives
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Foster meaningful conversations around important topics
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Support writers in their creative and professional journey
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-8 text-white">
                <Award size={48} className="mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  To become the world's most trusted platform for authentic storytelling, 
                  where every voice can find its audience and every reader can discover 
                  perspectives that broaden their understanding of the world.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge color="green" className="mb-4">
              <Heart size={14} className="mr-1" />
              Our Values
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Guides Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These core principles shape everything we do, from content creation to community building.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <value.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge color="purple" className="mb-4">
              <Users size={14} className="mr-1" />
              Meet the Team
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Minds Behind the Magic
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Passionate professionals dedicated to creating an exceptional experience for our community.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Star size={12} className="text-green-500" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {member.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {member.expertise.map(skill => (
                      <Badge key={skill} color="gray" size="xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <BookOpen size={12} />
                    {member.posts} articles
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge color="blue" className="mb-4">
              <TrendingUp size={14} className="mr-1" />
              Our Journey
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Milestones & Growth
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 to-blue-600 h-full" />
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <Card className="border-0 shadow-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                      {milestone.event}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {milestone.description}
                    </p>
                  </Card>
                </div>

                {/* Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10" />

                {/* Year */}
                <div className={`w-2/12 text-center ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {milestone.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who are already sharing their perspectives and building their audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" color="light">
                Start Writing Today
              </Button>
              <Button size="lg" color="light" variant="outline">
                Learn About Writing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;