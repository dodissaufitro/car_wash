<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('services/index', [
            'services' => Service::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_service' => ['required', 'string', 'max:255'],
            'category_id'  => ['nullable', 'integer', 'exists:service_categories,id'],
            'harga'        => ['required', 'numeric', 'min:0'],
            'deskripsi'    => ['nullable', 'string'],
            'image'        => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            $filename = uniqid('svc_').'.'.$request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('menu'), $filename);
            $validated['image'] = $filename;
        }

        Service::create($validated);

        return back()->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'nama_service' => ['required', 'string', 'max:255'],
            'category_id'  => ['nullable', 'integer', 'exists:service_categories,id'],
            'harga'        => ['required', 'numeric', 'min:0'],
            'deskripsi'    => ['nullable', 'string'],
            'image'        => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            $filename = uniqid('svc_').'.'.$request->file('image')->getClientOriginalExtension();
            $request->file('image')->move(public_path('menu'), $filename);
            $validated['image'] = $filename;
        } else {
            unset($validated['image']);
        }

        $service->update($validated);

        return back()->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return back()->with('success', 'Layanan berhasil dihapus.');
    }
}
