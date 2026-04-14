<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Queue;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TransactionStoreTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsUser(): static
    {
        return $this->actingAs(User::factory()->create());
    }

    private function payload(array $overrides = []): array
    {
        $service = Service::factory()->create();

        return array_merge([
            'tanggal'      => now()->toDateString(),
            'status'       => 'Pending',
            'add_to_queue' => false,
            'details'      => [
                ['service_id' => $service->id, 'qty' => 1, 'harga' => $service->harga],
            ],
        ], $overrides);
    }

    #[Test]
    public function it_creates_transaction_with_existing_customer_and_vehicle(): void
    {
        $vehicle = Vehicle::factory()->create();

        $response = $this->actingAsUser()->post(route('transactions.store'), $this->payload([
            'customer_id' => $vehicle->customer_id,
            'vehicle_id'  => $vehicle->id,
        ]));

        $response->assertRedirect();
        $this->assertDatabaseCount('transactions', 1);
        $this->assertDatabaseCount('queues', 0);
    }

    #[Test]
    public function it_creates_queue_when_add_to_queue_is_true(): void
    {
        $vehicle = Vehicle::factory()->create();

        $this->actingAsUser()->post(route('transactions.store'), $this->payload([
            'customer_id'  => $vehicle->customer_id,
            'vehicle_id'   => $vehicle->id,
            'add_to_queue' => true,
        ]));

        $transaction = Transaction::first();
        $this->assertDatabaseCount('queues', 1);
        $this->assertDatabaseHas('queues', [
            'transaction_id' => $transaction->id,
            'nomor_antrian'  => 1,
            'status'         => 'Menunggu',
        ]);
    }

    #[Test]
    public function it_assigns_incrementing_queue_numbers(): void
    {
        $v1 = Vehicle::factory()->create();
        $v2 = Vehicle::factory()->create();

        Queue::factory()->create(['nomor_antrian' => 5]);

        $this->actingAsUser()->post(route('transactions.store'), $this->payload([
            'customer_id'  => $v1->customer_id,
            'vehicle_id'   => $v1->id,
            'add_to_queue' => true,
        ]));

        $this->assertDatabaseHas('queues', ['nomor_antrian' => 6]);
    }

    #[Test]
    public function it_creates_new_customer_and_vehicle_when_using_new_option(): void
    {
        $service = Service::factory()->create();

        $response = $this->actingAsUser()->post(route('transactions.store'), [
            'customer_id'  => '__new__',
            'vehicle_id'   => '__new__',
            'tanggal'      => now()->toDateString(),
            'status'       => 'Pending',
            'add_to_queue' => true,
            'new_customer' => [
                'nama'   => 'Budi Santoso',
                'no_hp'  => '081234567890',
                'alamat' => 'Jl. Merdeka No. 1',
            ],
            'new_vehicle'  => [
                'jenis_kendaraan' => 'Motor',
                'merk'            => 'Honda',
                'nomor_polisi'    => 'B 9999 ZZZ',
            ],
            'details' => [
                ['service_id' => $service->id, 'qty' => 1, 'harga' => $service->harga],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('customers', ['nama' => 'Budi Santoso']);
        $this->assertDatabaseHas('vehicles', ['nomor_polisi' => 'B 9999 ZZZ']);
        $this->assertDatabaseCount('transactions', 1);
        $this->assertDatabaseCount('queues', 1);

        $customer = Customer::where('nama', 'Budi Santoso')->first();
        $vehicle  = Vehicle::where('nomor_polisi', 'B 9999 ZZZ')->first();
        $this->assertEquals($customer->id, $vehicle->customer_id);
    }

    #[Test]
    public function it_requires_new_customer_nama_when_using_new_customer(): void
    {
        $service = Service::factory()->create();

        $response = $this->actingAsUser()->post(route('transactions.store'), [
            'customer_id'  => '__new__',
            'vehicle_id'   => '__new__',
            'tanggal'      => now()->toDateString(),
            'status'       => 'Pending',
            'new_customer' => ['nama' => '', 'no_hp' => '', 'alamat' => ''],
            'new_vehicle'  => ['jenis_kendaraan' => 'Motor', 'merk' => '', 'nomor_polisi' => 'B 1111 XYZ'],
            'details'      => [['service_id' => $service->id, 'qty' => 1, 'harga' => $service->harga]],
        ]);

        $response->assertSessionHasErrors('new_customer.nama');
        $this->assertDatabaseCount('transactions', 0);
    }

    #[Test]
    public function it_requires_unique_nomor_polisi_when_using_new_vehicle(): void
    {
        $existing = Vehicle::factory()->create(['nomor_polisi' => 'B 2222 XYZ']);
        $service  = Service::factory()->create();

        $response = $this->actingAsUser()->post(route('transactions.store'), [
            'customer_id'  => '__new__',
            'vehicle_id'   => '__new__',
            'tanggal'      => now()->toDateString(),
            'status'       => 'Pending',
            'new_customer' => ['nama' => 'Test User', 'no_hp' => '', 'alamat' => ''],
            'new_vehicle'  => ['jenis_kendaraan' => 'Motor', 'merk' => 'Honda', 'nomor_polisi' => 'B 2222 XYZ'],
            'details'      => [['service_id' => $service->id, 'qty' => 1, 'harga' => $service->harga]],
        ]);

        $response->assertSessionHasErrors('new_vehicle.nomor_polisi');
    }
}
