// Run this after setting up Firebase CLI and authentication

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Firebase configuration from environment variables
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data for initial setup
const sampleUsers = [
  {
    id: 'manager-demo-001',
    email: 'manager@nanocomputing.com',
    full_name: 'Manager Admin',
    role: 'manager',
    hourly_rate: null,
    department: 'Management',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'employee-demo-001',
    email: 'john@nanocomputing.com',
    full_name: 'John Doe',
    role: 'employee',
    hourly_rate: 1500,
    department: 'Development',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'employee-demo-002',
    email: 'sarah@nanocomputing.com',
    full_name: 'Sarah Johnson',
    role: 'employee',
    hourly_rate: 1600,
    department: 'Design',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sampleWorkTickets = [
  {
    id: 'ticket-001',
    employee_id: 'employee-demo-001',
    manager_id: 'manager-demo-001',
    work_date: '2024-01-15',
    start_time: '09:00',
    end_time: '17:00',
    task_description: 'Implement user authentication module for the employee management system',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'ticket-002',
    employee_id: 'employee-demo-002',
    manager_id: 'manager-demo-001',
    work_date: '2024-01-15',
    start_time: '09:00',
    end_time: '16:00',
    task_description: 'Design user interface mockups for dashboard components',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sampleGoals = [
  {
    id: 'goal-001',
    employee_id: 'employee-demo-001',
    title: 'Monthly Hours Target',
    description: 'Complete 160 hours of productive work this month',
    target_value: 160,
    current_value: 120,
    unit: 'hours',
    deadline: '2024-01-31',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'goal-002',
    employee_id: 'employee-demo-001',
    title: 'Task Completion Goal',
    description: 'Complete 25 work tickets this month',
    target_value: 25,
    current_value: 18,
    unit: 'tickets',
    deadline: '2024-01-31',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const sampleNotifications = [
  {
    id: 'notification-001',
    user_id: 'employee-demo-001',
    type: 'ticket_approved',
    title: 'Work Ticket Approved',
    message: 'Your work ticket "Implement user authentication module" has been approved by the manager.',
    is_read: false,
    priority: 'medium',
    created_at: new Date().toISOString()
  },
  {
    id: 'notification-002',
    user_id: 'employee-demo-001',
    type: 'goal_reminder',
    title: 'Goal Deadline Approaching',
    message: 'Your monthly hours target goal is due in 5 days. Current progress: 75%',
    is_read: false,
    priority: 'high',
    created_at: new Date().toISOString()
  }
];

// Function to initialize collections
async function initializeDatabase() {
  try {
    console.log('🔥 Initializing Firebase Database Collections...');

    // Create users collection
    console.log('📝 Creating users collection...');
    for (const user of sampleUsers) {
      await setDoc(doc(db, 'users', user.id), user);
      console.log(`✅ Created user: ${user.full_name}`);
    }

    // Create workTickets collection
    console.log('📋 Creating workTickets collection...');
    for (const ticket of sampleWorkTickets) {
      await setDoc(doc(db, 'workTickets', ticket.id), ticket);
      console.log(`✅ Created work ticket: ${ticket.id}`);
    }

    // Create goals collection
    console.log('🎯 Creating goals collection...');
    for (const goal of sampleGoals) {
      await setDoc(doc(db, 'goals', goal.id), goal);
      console.log(`✅ Created goal: ${goal.title}`);
    }

    // Create notifications collection
    console.log('🔔 Creating notifications collection...');
    for (const notification of sampleNotifications) {
      await setDoc(doc(db, 'notifications', notification.id), notification);
      console.log(`✅ Created notification: ${notification.title}`);
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('');
    console.log('📊 Collections created:');
    console.log('   - users (3 documents)');
    console.log('   - workTickets (2 documents)');
    console.log('   - goals (2 documents)');
    console.log('   - notifications (2 documents)');
    console.log('');
    console.log('🔐 Demo credentials for testing:');
    console.log('   Manager: manager@nanocomputing.com');
    console.log('   Employee: john@nanocomputing.com');
    console.log('   (You\'ll need to set up authentication first)');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase();
