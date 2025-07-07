<script lang="ts">
  // On définit les variables pour lier les champs du formulaire
  let username = '';
  let email = '';
  let password = '';

  // Une variable pour stocker le message de succès
  let message = '';

  // La fonction appelée à la soumission du formulaire
  function handleSubmit() {
    // Dans une vraie app, on enverrait les données à un serveur
    // Ici, on se contente d'afficher un message de succès
    message = `Bienvenue, ${username} ! Votre compte a été créé.`;
  }
</script>

<main>
  <div class="card">
    <div class="card-header">
      <h1>Créer un Compte</h1>
      <p>Rejoignez-nous en quelques secondes.</p>
    </div>

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" bind:value={username} required placeholder="ex: SophieDupond" />
      </div>

      <div class="form-group">
        <label for="email">Adresse E-mail</label>
        <input type="email" id="email" bind:value={email} required placeholder="sophie.dupond@email.com" />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" bind:value={password} required placeholder="••••••••" />
      </div>

      <button type="submit">S'inscrire</button>
    </form>

    {#if message}
      <div id="message-container" class="success-message">
        {message}
      </div>
    {/if}
  </div>
</main>

<style>
  /* Définition de nos couleurs pour un style moderne */
  :root {
    --bg-color: #121212;
    --card-bg-color: #1e1e1e;
    --text-color: #e0e0e0;
    --primary-color: #bb86fc;
    --label-color: #a0a0a0;
    --border-color: #333333;
    --success-color: #03dac6;
  }

  /* Reset et style global du body */
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    display: grid;
    place-items: center;
    min-height: 100vh;
  }

  .card {
    background-color: var(--card-bg-color);
    padding: 2.5rem;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border-color);
    animation: fadeIn 0.5s ease-in-out;
  }

  .card-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    color: var(--primary-color);
  }

  p {
    margin-top: 0.5rem;
    color: var(--label-color);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--label-color);
  }

  input {
    width: 100%;
    padding: 0.8rem 1rem;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color);
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(187, 134, 252, 0.25);
  }

  button {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    background-color: var(--primary-color);
    color: #121212;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;
  }

  button:hover {
    transform: translateY(-2px);
    background-color: #a053f7;
  }

  .success-message {
    text-align: center;
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: rgba(3, 218, 198, 0.1);
    color: var(--success-color);
    border-radius: 8px;
    border: 1px solid var(--success-color);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>