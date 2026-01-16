-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create types
create type payment_method as enum ('pix', 'dinheiro', 'cartao');
create type order_type as enum ('entrega', 'retirada');
create type order_status as enum ('pendente', 'producao', 'entrega', 'concluido', 'cancelado');

-- Create Tables

-- Categories
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  category text, -- Using text to store category name as per current frontend logic (or can be FK to categories.id)
  image text,
  is_active boolean default true,
  options jsonb default '[]'::jsonb, -- Storing options as JSONB array
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Neighborhoods
create table neighborhoods (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  fee numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Store Settings
create table store_settings (
  id uuid default uuid_generate_v4() primary key,
  is_open boolean default true,
  closed_message text,
  whatsapp_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  customer_phone text,
  neighborhood text,
  street text,
  number text,
  reference text,
  items jsonb not null, -- Storing cart items as JSONB
  total_value numeric not null,
  payment_method text not null, -- Storing as text to be safe with frontend values, or cast to enum
  change_for numeric,
  delivery_type text not null,
  status order_status default 'pendente',
  custom_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Storage Bucket
insert into storage.buckets (id, name, public) 
values ('products', 'products', true)
on conflict (id) do nothing;

-- Security Policies (RLS)

-- Enable RLS
alter table categories enable row level security;
alter table products enable row level security;
alter table neighborhoods enable row level security;
alter table store_settings enable row level security;
alter table orders enable row level security;
-- alter table storage.objects enable row level security; -- RLS is enabled by default, and modifying it requires superuser permissions

-- Policies

-- Public Read Access
create policy "Public can view categories" on categories for select using (true);
create policy "Public can view products" on products for select using (true);
create policy "Public can view neighborhoods" on neighborhoods for select using (true);
create policy "Public can view store settings" on store_settings for select using (true);

-- Orders: Public can create, Admin can view/update
create policy "Public can create orders" on orders for insert with check (true);
create policy "Admin can view all orders" on orders for select to authenticated using (true);
create policy "Admin can update orders" on orders for update to authenticated using (true);
create policy "Admin can delete orders" on orders for delete to authenticated using (true);

-- Admin CRUD Access (Authenticated users)
create policy "Admin can insert categories" on categories for insert to authenticated with check (true);
create policy "Admin can update categories" on categories for update to authenticated using (true);
create policy "Admin can delete categories" on categories for delete to authenticated using (true);

create policy "Admin can insert products" on products for insert to authenticated with check (true);
create policy "Admin can update products" on products for update to authenticated using (true);
create policy "Admin can delete products" on products for delete to authenticated using (true);

create policy "Admin can insert neighborhoods" on neighborhoods for insert to authenticated with check (true);
create policy "Admin can update neighborhoods" on neighborhoods for update to authenticated using (true);
create policy "Admin can delete neighborhoods" on neighborhoods for delete to authenticated using (true);

create policy "Admin can insert store_settings" on store_settings for insert to authenticated with check (true);
create policy "Admin can update store_settings" on store_settings for update to authenticated using (true);

-- Storage Policies
create policy "Public can view product images" on storage.objects for select using ( bucket_id = 'products' );
create policy "Admin can upload product images" on storage.objects for insert to authenticated with check ( bucket_id = 'products' );
create policy "Admin can update product images" on storage.objects for update to authenticated using ( bucket_id = 'products' );
create policy "Admin can delete product images" on storage.objects for delete to authenticated using ( bucket_id = 'products' );

-- Initialize Store Settings if empty
insert into store_settings (is_open, closed_message, whatsapp_number)
select true, 'Estamos fechados no momento.', '5500000000000'
where not exists (select 1 from store_settings);
