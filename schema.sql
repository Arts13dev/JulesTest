-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone,

  primary key (id),
  unique(id),
  constraint full_name_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create product categories enum
create type product_category as enum ('weaves', 'smartphones', 'laptops', 'perfumes');

-- Create product condition enum
create type product_condition as enum ('new', 'used');

-- Create a table for products
create table products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  category product_category not null,
  condition product_condition not null,
  stock integer not null default 1,
  user_id uuid references auth.users
);

-- Set up Row Level Security (RLS) for products table
alter table products
  enable row level security;

create policy "Products are viewable by everyone." on products
  for select using (true);

create policy "Users can insert their own products." on products
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own products." on products
  for update using (auth.uid() = user_id);

create policy "Users can delete their own products." on products
  for delete using (auth.uid() = user_id);


-- Set up Storage for product images
-- Note: You might need to enable the Storage service in your Supabase project first.
insert into storage.buckets (id, name, public)
values ('product_images', 'product_images', true);

create policy "Product images are publicly accessible." on storage.objects
  for select using (bucket_id = 'product_images');

create policy "Anyone can upload a product image." on storage.objects
  for insert with check (bucket_id = 'product_images');

create policy "Anyone can update a product image." on storage.objects
  for update with check (bucket_id = 'product_images');
