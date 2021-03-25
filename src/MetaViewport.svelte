<script>
  import { onMount } from 'svelte';

  export let content;

  let metaViewport;
  let initialContent;

  onMount(() => {
    metaViewport = document.querySelector('meta[name=viewport]') || createMeta();

    if (metaViewport.isConnected) {
      initialContent = metaViewport.content;
    } else {
      insertMeta(metaViewport);
    }

    metaViewport.content = content;

    return () => {
      restoreMeta();
    };
  });

  function restoreMeta() {
    if (typeof initialContent !== 'undefined') {
      metaViewport.content = initialContent;
    } else {
      metaViewport.remove();
    }
  }

  function createMeta() {
    const meta = document.createElement('meta');
    meta.name = 'viewport';

    return meta;
  }

  function insertMeta(meta) {
    const [firstMeta] = document.head.getElementsByTagName('meta');
    if (firstMeta) {
      firstMeta.parentNode.insertBefore(metaViewport, firstMeta.nextSibling);
    } else {
      document.head.prepend(meta);
    }
  }
</script>
