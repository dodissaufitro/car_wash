<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('employees/index', [
            'employees' => Employee::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'    => ['required', 'string', 'max:255'],
            'jabatan' => ['nullable', 'string', 'max:100'],
            'no_hp'   => ['nullable', 'string', 'max:20'],
        ]);

        Employee::create($validated);

        return back()->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'nama'    => ['required', 'string', 'max:255'],
            'jabatan' => ['nullable', 'string', 'max:100'],
            'no_hp'   => ['nullable', 'string', 'max:20'],
        ]);

        $employee->update($validated);

        return back()->with('success', 'Karyawan berhasil diperbarui.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->delete();

        return back()->with('success', 'Karyawan berhasil dihapus.');
    }
}
