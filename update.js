const { execSync } = require("child_process");

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  console.log("🚀 Generando photos.json...");
  run("node generate-photos-json.js");

  console.log("📸 Añadiendo cambios a Git...");
  run("git add .");

  console.log("💬 Creando commit automático...");
  run('git commit -m "Actualizo galería automáticamente"');

  console.log("⬆️ Subiendo cambios a GitHub...");
  run("git push");

  console.log("✨ Listo! Galería actualizada.");
} catch (err) {
  console.error("\n❌ Error durante la actualización:");
  console.error(err.message || err);
}
