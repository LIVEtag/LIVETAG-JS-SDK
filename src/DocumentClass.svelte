<script>
  import { onMount } from 'svelte';

  export let className;

  onMount(() => {
    document.documentElement.classList.add(className);

    return () => {
      document.documentElement.classList.remove(className);
    };
  });
</script>
