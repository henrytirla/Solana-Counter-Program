import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterProgram } from "../target/types/counter_program";

describe("counter_program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CounterProgram as Program<CounterProgram>;
  let counterAccount: anchor.web3.PublicKey;

  it("Initializes and increments the counter", async () => {
    // Generate a new keypair for the counter account.
    const counter = anchor.web3.Keypair.generate();

    // Initialize the counter account.
    const tx = await program.methods.initialize()
        .accounts({
          counter: counter.publicKey,
          user: anchor.getProvider().wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([counter])
        .rpc();
    console.log("Initialize transaction signature:", tx);

    // Increment the counter value.
    await program.methods.increment()
        .accounts({
          counter: counter.publicKey,
        })
        .rpc();
    console.log("Increment transaction executed.");

    // Fetch the updated counter value.
    const counterAccount = await program.account.counter.fetch(counter.publicKey);
    console.log("Counter value:", counterAccount.value.toString());

    // Assertions (if needed)
    // assert.equal(counterAccount.value.toString(), "1");
  });
});

