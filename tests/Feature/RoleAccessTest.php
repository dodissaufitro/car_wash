<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    private function createRole(string $slug, array $permissions = []): Role
    {
        return Role::create([
            'name'        => ucfirst($slug),
            'slug'        => $slug,
            'description' => null,
            'permissions' => $permissions,
        ]);
    }

    private function userWithRole(string $slug, array $permissions = []): User
    {
        $role = $this->createRole($slug, $permissions);

        return User::factory()->create(['role_id' => $role->id]);
    }

    public function test_admin_can_access_roles_page(): void
    {
        $admin = $this->userWithRole('admin', array_keys(Role::allPermissions()));

        $this->actingAs($admin)
            ->get(route('roles.index'))
            ->assertOk();
    }

    public function test_kasir_cannot_access_roles_page(): void
    {
        $kasir = $this->userWithRole('kasir', ['dashboard', 'transactions.view']);

        $this->actingAs($kasir)
            ->get(route('roles.index'))
            ->assertForbidden();
    }

    public function test_teknisi_cannot_access_roles_page(): void
    {
        $teknisi = $this->userWithRole('teknisi', ['dashboard', 'queue.view']);

        $this->actingAs($teknisi)
            ->get(route('roles.index'))
            ->assertForbidden();
    }

    public function test_admin_can_access_users_page(): void
    {
        $admin = $this->userWithRole('admin', array_keys(Role::allPermissions()));

        $this->actingAs($admin)
            ->get(route('users.index'))
            ->assertOk();
    }

    public function test_non_admin_cannot_access_users_page(): void
    {
        $kasir = $this->userWithRole('kasir', ['dashboard']);

        $this->actingAs($kasir)
            ->get(route('users.index'))
            ->assertForbidden();
    }

    public function test_user_has_permission_checks_correctly(): void
    {
        $admin  = $this->userWithRole('admin', ['users.view', 'roles.manage']);
        $kasir  = $this->userWithRole('kasir', ['transactions.view']);
        $noRole = User::factory()->create(['role_id' => null]);

        $this->assertTrue($admin->hasPermission('users.view'));
        $this->assertFalse($admin->hasPermission('transactions.view'));
        $this->assertTrue($kasir->hasPermission('transactions.view'));
        $this->assertFalse($kasir->hasPermission('users.view'));
        $this->assertFalse($noRole->hasPermission('users.view'));
    }

    public function test_admin_can_create_role(): void
    {
        $admin = $this->userWithRole('admin', array_keys(Role::allPermissions()));

        $this->actingAs($admin)
            ->post(route('roles.store'), [
                'name'        => 'Supervisor',
                'slug'        => 'supervisor',
                'description' => 'Supervisor role',
                'permissions' => ['dashboard', 'reports.view'],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('roles', ['slug' => 'supervisor']);
    }

    public function test_admin_can_delete_role_without_users(): void
    {
        $admin     = $this->userWithRole('admin', array_keys(Role::allPermissions()));
        $emptyRole = $this->createRole('temp', []);

        $this->actingAs($admin)
            ->delete(route('roles.destroy', $emptyRole->id))
            ->assertRedirect();

        $this->assertDatabaseMissing('roles', ['id' => $emptyRole->id]);
    }

    public function test_admin_cannot_delete_role_with_users(): void
    {
        $admin    = $this->userWithRole('admin', array_keys(Role::allPermissions()));
        $usedRole = $this->createRole('used', []);
        User::factory()->create(['role_id' => $usedRole->id]);

        $this->actingAs($admin)
            ->delete(route('roles.destroy', $usedRole->id))
            ->assertRedirect();

        $this->assertDatabaseHas('roles', ['id' => $usedRole->id]);
    }
}

