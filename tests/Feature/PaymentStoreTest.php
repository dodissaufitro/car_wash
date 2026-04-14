<?php

namespace Tests\Feature;

use App\Models\Queue;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PaymentStoreTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsUser(): static
    {
        return $this->actingAs(User::factory()->create());
    }

    #[Test]
    public function it_only_shows_pending_transactions_in_dropdown(): void
    {
        $pending = Transaction::factory()->create(['status' => 'Pending']);
        $selesai = Transaction::factory()->create(['status' => 'Selesai']);

        $response = $this->actingAsUser()->get(route('payments.index'));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
                ->component('payments/index')
                ->where('transactions', fn ($transactions) => collect($transactions)->pluck('id')->contains($pending->id)
                    && ! collect($transactions)->pluck('id')->contains($selesai->id))
        );
    }

    #[Test]
    public function it_creates_payment_and_marks_transaction_selesai(): void
    {
        $transaction = Transaction::factory()->create(['status' => 'Pending']);

        $this->actingAsUser()->post(route('payments.store'), [
            'transaction_id' => $transaction->id,
            'metode'         => 'Cash',
            'jumlah_bayar'   => 30000,
            'kembalian'      => 5000,
        ]);

        $this->assertDatabaseHas('payments', [
            'transaction_id' => $transaction->id,
            'metode'         => 'Cash',
        ]);
        $this->assertDatabaseHas('transactions', [
            'id'     => $transaction->id,
            'status' => 'Selesai',
        ]);
    }

    #[Test]
    public function it_updates_queue_status_to_selesai_after_payment(): void
    {
        $transaction = Transaction::factory()->create(['status' => 'Pending']);
        $queue = Queue::factory()->create([
            'transaction_id' => $transaction->id,
            'status'         => 'Menunggu',
        ]);

        $this->actingAsUser()->post(route('payments.store'), [
            'transaction_id' => $transaction->id,
            'metode'         => 'Transfer',
            'jumlah_bayar'   => 25000,
            'kembalian'      => 0,
        ]);

        $this->assertDatabaseHas('queues', [
            'id'     => $queue->id,
            'status' => 'Selesai',
        ]);
    }

    #[Test]
    public function it_marks_transaction_selesai_even_if_no_queue_exists(): void
    {
        $transaction = Transaction::factory()->create(['status' => 'Pending']);

        $this->actingAsUser()->post(route('payments.store'), [
            'transaction_id' => $transaction->id,
            'metode'         => 'QRIS',
            'jumlah_bayar'   => 25000,
            'kembalian'      => 0,
        ]);

        $this->assertDatabaseHas('transactions', ['id' => $transaction->id, 'status' => 'Selesai']);
        $this->assertDatabaseCount('queues', 0);
    }
}
