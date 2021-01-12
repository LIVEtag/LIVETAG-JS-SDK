export function doJob(): number {
  //
  // Do some job
  //

  return Math.random();
}

async function main() {
  console.log(doJob());
}

main()
  .then(() => {
    console.log('[Livetag][init]');
  })
  .catch((e) => {
    console.error(e);
  });
