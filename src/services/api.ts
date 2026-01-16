import { supabase } from './supabase';
import { Product, Category, Neighborhood, StoreSettings, Order, OrderStatus } from '../../types';

// ==========================================
// AUTHENTICATION
// ==========================================

export const signInWithEmail = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
};

export const signOut = async () => {
    return await supabase.auth.signOut();
};

// ==========================================
// PRODUCTS
// ==========================================

export const fetchProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data || [];
};

export const upsertProduct = async (product: Partial<Product>) => {
    // If ID looks like a UUID, use it. If it's empty or temporary, let Supabase generate one.
    const { id, ...rest } = product;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

    const payload = isUUID ? { id, ...rest } : rest;

    const { data, error } = await supabase
        .from('products')
        .upsert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteProduct = async (id: string) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// ==========================================
// CATEGORIES
// ==========================================

export const fetchCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
};

export const upsertCategory = async (category: Partial<Category>) => {
    const { id, ...rest } = category;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

    const payload = isUUID ? { id, ...rest } : rest;

    const { data, error } = await supabase
        .from('categories')
        .upsert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteCategory = async (id: string) => {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// ==========================================
// NEIGHBORHOODS
// ==========================================

export const fetchNeighborhoods = async (): Promise<Neighborhood[]> => {
    const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching neighborhoods:', error);
        return [];
    }
    return data || [];
};

export const upsertNeighborhood = async (neighborhood: Partial<Neighborhood>) => {
    const { id, ...rest } = neighborhood;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

    const payload = isUUID ? { id, ...rest } : rest;

    const { data, error } = await supabase
        .from('neighborhoods')
        .upsert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteNeighborhood = async (id: string) => {
    const { error } = await supabase
        .from('neighborhoods')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// ==========================================
// STORE SETTINGS
// ==========================================

export const fetchStoreSettings = async (): Promise<StoreSettings | null> => {
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        // If no rows, return null, caller might handle it or we insert default
        return null;
    }
    return data;
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    // First, get the ID of the single row
    const { data: current } = await supabase
        .from('store_settings')
        .select('id')
        .limit(1)
        .single();

    if (current) {
        const { error } = await supabase
            .from('store_settings')
            .update(settings)
            .eq('id', current.id);
        if (error) throw error;
    } else {
        // Insert if no settings exist
        const { error } = await supabase
            .from('store_settings')
            .insert(settings);
        if (error) throw error;
    }
};

export const subscribeToSettings = (callback: (settings: StoreSettings) => void) => {
    return supabase
        .channel('public:store_settings')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'store_settings' },
            (payload) => {
                if (payload.new) {
                    callback(payload.new as StoreSettings);
                }
            }
        )
        .subscribe();
};

// ==========================================
// ORDERS
// ==========================================

export const createOrder = async (order: Partial<Order>) => {
    // Ensure we strip ID if it's not a valid UUID (or let DB handle it)
    // Usually for create, we just omit ID.
    const { id, created_at, ...rest } = order;

    const { data, error } = await supabase
        .from('orders')
        .insert(rest)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const fetchOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
    return data || [];
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};

export const deleteOrder = async (id: string) => {
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const subscribeToOrders = (callback: () => void) => {
    return supabase
        .channel('public:orders')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            () => {
                // Trigger callback on any change (INSERT, UPDATE, DELETE)
                callback();
            }
        )
        .subscribe();
};

// ==========================================
// STORAGE (IMAGES)
// ==========================================

export const uploadProductImage = async (file: File): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        // Unique name to avoid collisions
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return null;
        }

        const { data } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error in uploadProductImage:', error);
        return null;
    }
};
