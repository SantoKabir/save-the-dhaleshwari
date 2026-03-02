"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from 'next/headers';

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/admin/dashboard");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function forgotPassword(email: string) {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    if (!email) {
        return { error: 'Email is required' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
        console.error('Password reset error:', error.message);
        return { error: 'Could not send password reset email' };
    }

    return { data: { success: true, message: 'Check your email for a password reset link' } };
}

export async function resetPassword(password: string, confirmPassword: string) {
    const supabase = await createClient();

    if (!password || !confirmPassword) {
        return { error: 'Password and confirm password are required' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    const { error } = await supabase.auth.updateUser({
        password,
    });

    if (error) {
        return { error: 'Password update failed' };
    }

    return { data: { success: true, message: 'Password updated successfully' } };
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
        return { error: 'Not authenticated' };
    }

    if (!currentPassword || !newPassword) {
        return { error: 'Current and new password are required' };
    }

    if (newPassword.length < 6) {
        return { error: 'New password must be at least 6 characters' };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    });

    if (signInError) {
        return { error: 'Current password is incorrect' };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        return { error: 'Failed to update password' };
    }

    return { data: { success: true, message: 'Password changed successfully' } };
}