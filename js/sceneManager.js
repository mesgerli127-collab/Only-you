export class SceneManager {
  constructor() {
    this.scenes = document.querySelectorAll('.scene');
    this.currentSceneId = 'scene-awakening';
  }

  goToScene(sceneId) {
    const targetScene = document.getElementById(sceneId);
    if (!targetScene) return;

    this.scenes.forEach(scene => {
      scene.classList.remove('active');
    });

    targetScene.classList.add('active');
    this.currentSceneId = sceneId;
  }
}