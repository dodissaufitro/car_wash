<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasRole
{
    /**
     * Pastikan user memiliki salah satu role yang diizinkan.
     *
     * Penggunaan: ->middleware('role:admin') atau ->middleware('role:admin,kasir')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        abort(403, 'Anda tidak memiliki akses ke halaman ini.');
    }
}

