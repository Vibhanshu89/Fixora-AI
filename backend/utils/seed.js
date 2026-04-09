require('dotenv').config();
const mongoose = require('mongoose');
const Worker = require('../models/Worker');
const User = require('../models/User');

const workers = [
  // Electrical
  { name: 'Raju Kumar', email: 'raju@fixora.ai', phone: '9876543210', category: 'electrical', skills: ['Fan Repair', 'Wiring', 'Switch Board'], city: 'Delhi', rating: 4.8, totalJobs: 142, pricePerHour: 300, experience: 5, bio: 'Expert electrician with 5 years of experience in residential wiring and appliance repair.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Suresh Yadav', email: 'suresh@fixora.ai', phone: '9876543211', category: 'electrical', skills: ['Inverter', 'MCB', 'Lighting'], city: 'Lucknow', rating: 4.6, totalJobs: 98, pricePerHour: 280, experience: 4, bio: 'Certified electrician specializing in power backup systems and lighting installations.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Rahul Electric', email: 'rahul@fixora.ai', phone: '9876543223', category: 'electrical', skills: ['Fan Repair', 'CCTV Installation', 'Electrical Audit'], city: 'Bangalore', rating: 4.9, totalJobs: 300, pricePerHour: 350, experience: 9, bio: 'Senior electrician and security systems expert with impeccable track record.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Amit Saxena', email: 'amit.e@fixora.ai', phone: '9123456780', category: 'electrical', skills: ['House Wiring', 'DP Box', 'Earthing'], city: 'Pune', rating: 4.7, totalJobs: 110, pricePerHour: 320, experience: 6, bio: 'Specialist in complex house wiring and electrical safety audits.', isAvailable: true, isVerified: true, avatar: '' },
  
  // Plumbing
  { name: 'Anil Sharma', email: 'anil@fixora.ai', phone: '9876543212', category: 'plumbing', skills: ['Pipe Leak', 'Tap Repair', 'Drain Cleaning'], city: 'Mumbai', rating: 4.7, totalJobs: 200, pricePerHour: 350, experience: 7, bio: 'Senior plumber with expertise in both residential and commercial plumbing systems.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Mohan Patel', email: 'mohan@fixora.ai', phone: '9876543213', category: 'plumbing', skills: ['Bathroom Fitting', 'Water Heater', 'Toilet Repair'], city: 'Delhi', rating: 4.5, totalJobs: 115, pricePerHour: 320, experience: 5, bio: 'Reliable plumber with strong focus on bathroom installations and repairs.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Tejpal Plumber', email: 'tejpal@fixora.ai', phone: '9876543224', category: 'plumbing', skills: ['RO Filter', 'Water Tank Cleaning', 'Overhead Tank'], city: 'Hyderabad', rating: 4.5, totalJobs: 90, pricePerHour: 300, experience: 4, bio: 'Specialist in water filter systems and residential plumbing maintenance.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Vikram Reddy', email: 'vikram.p@fixora.ai', phone: '9123456781', category: 'plumbing', skills: ['Leak Detection', 'Pipe Relining', 'Gas Geyser'], city: 'Chennai', rating: 4.8, totalJobs: 156, pricePerHour: 380, experience: 6, bio: 'Expert in high-pressure plumbing and leak detection technology.', isAvailable: true, isVerified: true, avatar: '' },

  // AC Repair
  { name: 'Vikram Singh', email: 'vikram@fixora.ai', phone: '9876543214', category: 'ac-repair', skills: ['AC Service', 'Gas Refill', 'AC Installation'], city: 'Bangalore', rating: 4.9, totalJobs: 310, pricePerHour: 500, experience: 8, bio: 'Top-rated AC technician with expertise in all major brands including LG, Samsung, Daikin.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Deepak Verma', email: 'deepak@fixora.ai', phone: '9876543215', category: 'ac-repair', skills: ['Split AC', 'Window AC', 'Cooling Issue'], city: 'Hyderabad', rating: 4.7, totalJobs: 187, pricePerHour: 450, experience: 6, bio: 'AC specialist with strong diagnostic skills and quick turnaround time.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Sanjay Jain', email: 'sanjay.ac@fixora.ai', phone: '9123456782', category: 'ac-repair', skills: ['Inverter AC', 'PCB Repair', 'Compressor'], city: 'Ahmedabad', rating: 4.6, totalJobs: 134, pricePerHour: 480, experience: 5, bio: 'Expert in inverter AC technology and mainboard (PCB) repairs.', isAvailable: true, isVerified: true, avatar: '' },

  // Carpentry
  { name: 'Ramesh Carpenter', email: 'ramesh@fixora.ai', phone: '9876543216', category: 'carpentry', skills: ['Furniture Repair', 'Door Fixing', 'Cabinet Work'], city: 'Delhi', rating: 4.6, totalJobs: 88, pricePerHour: 400, experience: 6, bio: 'Skilled carpenter for all wood work including furniture repair and custom installations.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Pawan Mistri', email: 'pawan.c@fixora.ai', phone: '9123456783', category: 'carpentry', skills: ['Wooden Floor', 'Lock Repair', 'Modular Kitchen'], city: 'Gurgaon', rating: 4.8, totalJobs: 112, pricePerHour: 450, experience: 7, bio: 'Specialist in modern modular kitchens and high-end wooden flooring.', isAvailable: true, isVerified: true, avatar: '' },

  // Cleaning
  { name: 'Dinesh Kumar', email: 'dinesh@fixora.ai', phone: '9876543217', category: 'cleaning', skills: ['Deep Cleaning', 'Sofa Cleaning', 'Kitchen Cleaning'], city: 'Mumbai', rating: 4.8, totalJobs: 250, pricePerHour: 250, experience: 4, bio: 'Professional cleaner offering comprehensive home cleaning services.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Priya Devi', email: 'priya@fixora.ai', phone: '9876543218', category: 'cleaning', skills: ['Home Cleaning', 'Bathroom Cleaning', 'Utensil Cleaning'], city: 'Lucknow', rating: 4.7, totalJobs: 175, pricePerHour: 220, experience: 3, bio: 'Experienced home cleaner known for attention to detail and punctuality.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Anjali Das', email: 'anjali.cl@fixora.ai', phone: '9123456784', category: 'cleaning', skills: ['Sanitization', 'Carpet Cleaning', 'Post-Construct'], city: 'Kolkata', rating: 4.6, totalJobs: 92, pricePerHour: 240, experience: 4, bio: 'Specialist in post-construction cleaning and deep tissue carpet cleaning.', isAvailable: true, isVerified: true, avatar: '' },

  // New Categories: CCTV
  { name: 'Aryan Security', email: 'aryan@fixora.ai', phone: '9123456785', category: 'cctv-installation', skills: ['IP Camera', 'DVR/NVR', 'Remote View'], city: 'Delhi', rating: 4.9, totalJobs: 210, pricePerHour: 550, experience: 6, bio: 'Professional security systems installer specializing in IP cameras and remote monitoring setup.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Sameer Khan', email: 'sameer.sec@fixora.ai', phone: '9123456786', category: 'cctv-installation', skills: ['Biometrics', 'Alarm System', 'CCTV Repair'], city: 'Mumbai', rating: 4.7, totalJobs: 145, pricePerHour: 500, experience: 5, bio: 'Integrated security solution expert for residential and small business needs.', isAvailable: true, isVerified: true, avatar: '' },

  // New Categories: RO Service
  { name: 'Gopal Water', email: 'gopal@fixora.ai', phone: '9123456787', category: 'ro-service', skills: ['Filter Change', 'TDS Check', 'RO Repair'], city: 'Noida', rating: 4.8, totalJobs: 320, pricePerHour: 300, experience: 8, bio: 'Water purification specialist with years of experience in all major RO brands.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Megha Service', email: 'megha.ro@fixora.ai', phone: '9123456788', category: 'ro-service', skills: ['Membrane Change', 'Installation', 'AMC'], city: 'Jaipur', rating: 4.6, totalJobs: 120, pricePerHour: 280, experience: 4, bio: 'Dedicated RO technician providing reliable maintenance and installation services.', isAvailable: true, isVerified: true, avatar: '' },

  // New Categories: Salon at Home
  { name: 'Sonal Beauty', email: 'sonal@fixora.ai', phone: '9123456789', category: 'salon-at-home', skills: ['Facial', 'Hair Cut', 'Waxing'], city: 'Chandigarh', rating: 4.9, totalJobs: 185, pricePerHour: 600, experience: 7, bio: 'Professional beautician offering premium salon services in the comfort of your home.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Neha Parlour', email: 'neha.s@fixora.ai', phone: '9123456790', category: 'salon-at-home', skills: ['Manicure', 'Pedicure', 'Threading'], city: 'Delhi', rating: 4.7, totalJobs: 240, pricePerHour: 550, experience: 6, bio: 'Experienced hair and skin specialist for on-demand home salon visits.', isAvailable: true, isVerified: true, avatar: '' },

  // New Categories: Gardening
  { name: 'Mali Ram', email: 'mali@fixora.ai', phone: '9123456791', category: 'gardening', skills: ['Pruning', 'Fertilizing', 'Vertical Garden'], city: 'Bangalore', rating: 4.8, totalJobs: 86, pricePerHour: 200, experience: 10, bio: 'Lifelong gardener with deep knowledge of indoor and outdoor plant care.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Lalit Garden', email: 'lalit.g@fixora.ai', phone: '9123456792', category: 'gardening', skills: ['Lawn Mowing', 'Pest Control', 'Plantation'], city: 'Pune', rating: 4.5, totalJobs: 54, pricePerHour: 180, experience: 5, bio: 'Reliable garden maintenance expert for residential balconies and backyards.', isAvailable: true, isVerified: true, avatar: '' },

  // Appliance Repair
  { name: 'Sanjay Gupta', email: 'sanjay@fixora.ai', phone: '9876543220', category: 'appliance-repair', skills: ['Washing Machine', 'Fridge Repair', 'Geyser Repair'], city: 'Delhi', rating: 4.8, totalJobs: 220, pricePerHour: 420, experience: 7, bio: 'Appliance repair expert with deep knowledge of all major home appliance brands.', isAvailable: true, isVerified: true, avatar: '' },
  { name: 'Kiran Technician', email: 'kiran@fixora.ai', phone: '9876543221', category: 'appliance-repair', skills: ['Microwave', 'Mixer Grinder', 'Water Purifier'], city: 'Bangalore', rating: 4.6, totalJobs: 145, pricePerHour: 380, experience: 5, bio: 'Trusted appliance technician with fast, efficient repair services.', isAvailable: true, isVerified: true, avatar: '' },

  // Pest Control
  { name: 'Abdul Pest Control', email: 'abdul@fixora.ai', phone: '9876543222', category: 'pest-control', skills: ['Cockroach Treatment', 'Termite Control', 'Rat Control'], city: 'Mumbai', rating: 4.7, totalJobs: 190, pricePerHour: 600, experience: 6, bio: 'Certified pest control professional using safe and effective treatments.', isAvailable: true, isVerified: true, avatar: '' },

  // Painting
  { name: 'Harish Painter', email: 'harish@fixora.ai', phone: '9876543219', category: 'painting', skills: ['Wall Painting', 'Waterproofing', 'Texture Paint'], city: 'Hyderabad', rating: 4.5, totalJobs: 67, pricePerHour: 380, experience: 5, bio: 'Professional painter offering interior and exterior painting with quality materials.', isAvailable: true, isVerified: true, avatar: '' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    await Worker.deleteMany({});
    await Worker.insertMany(workers);
    console.log(`✅ Seeded ${workers.length} workers`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@fixora.ai' });
    if (!adminExists) {
      await User.create({
        name: 'Fixora Admin',
        email: 'admin@fixora.ai',
        password: 'admin123456',
        role: 'admin',
        city: 'Delhi',
        isEmailVerified: true,
      });
      console.log('✅ Admin user created: admin@fixora.ai / admin123456');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
