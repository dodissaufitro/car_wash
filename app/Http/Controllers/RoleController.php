<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('roles/index', [
            'roles'          => Role::allWithUsers(),
            'allPermissions' => Role::allPermissions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:100'],
            'slug'        => ['required', 'string', 'max:50', 'unique:roles,slug', 'regex:/^[a-z0-9_]+$/'],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', 'in:'.implode(',', array_keys(Role::allPermissions()))],
        ]);

        Role::create($validated);

        return back()->with('success', 'Hak akses berhasil dibuat.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string', 'in:'.implode(',', array_keys(Role::allPermissions()))],
        ]);

        $role->update($validated);

        return back()->with('success', 'Hak akses berhasil diperbarui.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->users()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus role yang masih dipakai oleh pengguna.');
        }

        $role->delete();

        return back()->with('success', 'Hak akses berhasil dihapus.');
    }
}
