# Demo Users Setup Guide

This guide will help you set up demo user accounts for the Nano Computing ICT Employee Management System.

## Demo Credentials

The system comes with the following demo accounts:

### Manager Account
- **Email:** manager@nanocomputing.com
- **Password:** demo123
- **Access:** Full system access including employee management, ticket creation, reports, and email functionality

### Employee Account
- **Email:** john@nanocomputing.com
- **Password:** demo123
- **Access:** Personal dashboard and timesheet view only

## Setting Up Demo Users

Since Supabase Auth requires users to be created through their authentication system, you have two options:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User" and create the following users:

**Manager User:**
- Email: `manager@nanocomputing.com`
- Password: `demo123`
- Auto Confirm User: Yes

**Employee User:**
- Email: `john@nanocomputing.com`
- Password: `demo123`
- Auto Confirm User: Yes

4. After creating the auth users, run this SQL in the SQL Editor to create their profiles:

```sql
-- Insert manager profile
INSERT INTO profiles (id, email, full_name, role, hourly_rate, department)
SELECT
  id,
  'manager@nanocomputing.com',
  'Manager Admin',
  'manager',
  NULL,
  NULL
FROM auth.users
WHERE email = 'manager@nanocomputing.com'
ON CONFLICT (id) DO NOTHING;

-- Insert employee profile
INSERT INTO profiles (id, email, full_name, role, hourly_rate, department)
SELECT
  id,
  'john@nanocomputing.com',
  'John Doe',
  'employee',
  25.00,
  'Development'
FROM auth.users
WHERE email = 'john@nanocomputing.com'
ON CONFLICT (id) DO NOTHING;
```

5. (Optional) Add sample work tickets:

```sql
-- Insert sample work tickets for John Doe
INSERT INTO work_tickets (employee_id, work_date, start_time, end_time, task_description, status)
SELECT
  p.id,
  '2024-05-21',
  '09:00',
  '12:00',
  'Implemented authentication module for client portal',
  'approved'
FROM profiles p
WHERE p.email = 'john@nanocomputing.com';

INSERT INTO work_tickets (employee_id, work_date, start_time, end_time, task_description, status)
SELECT
  p.id,
  '2024-05-21',
  '13:00',
  '17:00',
  'Code review and bug fixes for payment integration',
  'approved'
FROM profiles p
WHERE p.email = 'john@nanocomputing.com';

INSERT INTO work_tickets (employee_id, work_date, start_time, end_time, task_description, status)
SELECT
  p.id,
  CURRENT_DATE,
  '09:00',
  '12:00',
  'Working on new feature implementation',
  'pending'
FROM profiles p
WHERE p.email = 'john@nanocomputing.com';
```

### Option 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Create manager user
supabase auth admin create-user manager@nanocomputing.com --password demo123

# Create employee user
supabase auth admin create-user john@nanocomputing.com --password demo123
```

Then run the SQL scripts from Option 1 to create profiles and tickets.

## Additional Employee Accounts

To add more employee demo accounts, follow the same pattern:

1. Create auth user in Supabase Dashboard
2. Run SQL to insert profile:

```sql
INSERT INTO profiles (id, email, full_name, role, hourly_rate, department)
SELECT
  id,
  'employee@example.com',
  'Employee Name',
  'employee',
  30.00,
  'Department Name'
FROM auth.users
WHERE email = 'employee@example.com'
ON CONFLICT (id) DO NOTHING;
```

## Troubleshooting

### "Invalid login credentials" error
- Make sure you created the auth users in Supabase Dashboard first
- Verify the email confirmation is disabled or users are auto-confirmed
- Check that the password matches exactly: `demo123`

### "User profile not found" error
- Run the profile INSERT SQL queries in the Supabase SQL Editor
- Make sure the email in the profiles table matches the auth.users email

### Employee sees no data
- Add work tickets using the SQL queries above
- Make sure the employee_id in work_tickets matches the profile id

## Next Steps

Once demo users are set up:
1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Click on the demo credential cards or manually enter credentials
4. Test both manager and employee workflows

## Production Deployment

For production:
1. Remove or disable demo accounts
2. Implement proper user registration flow
3. Set up email confirmation if required
4. Configure proper password policies
5. Add role-based access control at the API level
