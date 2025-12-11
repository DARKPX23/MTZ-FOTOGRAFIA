const { execSync } = require("child_process");

function run(command) {
  console.log(`$ ${command}`);
  return execSync(command, { stdio: "pipe" }).toString().trim();
}

console.log("🚀 Generando photos.json...");
try {
  console.log(run("node generate-photos-json.js"));
} catch (err) {
  console.error("❌ Error generando photos.json:");
  console.error(err.message);
  process.exit(1);
}

console.log("📸 Añadiendo cambios a Git...");
run("git add .");

console.log("💬 Creando commit automático...");
let commitOutput = "";
try {
  commitOutput = run('git commit -m "Actualizo galería automáticamente"');
} catch (err) {
  const msg = err.message;

  if (msg.includes("nothing to commit")) {
    console.log("⚠️ No hay cambios nuevos. La galería ya está actualizada.");
    process.exit(0);
  } else {
    console.error("❌ Error creando el commit:");
    console.error(msg);
    process.exit(1);
  }
}

console.log(commitOutput);

// Si sí hubo commit, entonces hacemos push
console.log("⬆️ Subiendo cambios a GitHub...");
try {
  console.log(run("git push"));
  console.log("✨ Actualización completa. Todo se subió correctamente.");
} catch (err) {
  console.error("❌ Error al hacer push a GitHub:");
  console.error(err.message);
  process.exit(1);
}
