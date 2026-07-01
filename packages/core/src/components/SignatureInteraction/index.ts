import { gsap } from 'gsap';

export interface SignatureInteractionConfig {
  type: 'ScriptToScreenReveal' | 'AudioSignalExplorer' | 'LensLightingBreakdown' | 'TimelineScrubReveal' | 'SetDesignLayerPeel' | 'CastingTapeMosaic' | 'ScoreToSceneSync' | 'FabricTextureExplorer' | 'EquipmentExplorer' | 'InteractiveScriptBeats';
  container: HTMLElement;
}

export class SignatureInteraction {
  private container: HTMLElement;
  private type: string;
  private isActive: boolean = false;

  constructor(config: SignatureInteractionConfig) {
    this.container = config.container;
    this.type = config.type;
    this.init();
  }

  private init(): void {
    this.container.classList.add('signature', `signature--${this.type.toLowerCase()}`);
    this.build();
  }

  private build(): void {
    switch (this.type) {
      case 'ScriptToScreenReveal':
        this.buildScriptToScreen();
        break;
      case 'AudioSignalExplorer':
        this.buildAudioSignal();
        break;
      case 'LensLightingBreakdown':
        this.buildLensLighting();
        break;
      case 'TimelineScrubReveal':
        this.buildTimelineScrub();
        break;
      case 'SetDesignLayerPeel':
        this.buildSetDesignLayer();
        break;
      case 'CastingTapeMosaic':
        this.buildCastingTape();
        break;
      case 'ScoreToSceneSync':
        this.buildScoreToScene();
        break;
      case 'FabricTextureExplorer':
        this.buildFabricTexture();
        break;
      case 'EquipmentExplorer':
        this.buildEquipmentExplorer();
        break;
      case 'InteractiveScriptBeats':
        this.buildInteractiveScript();
        break;
    }
  }

  private buildScriptToScreen(): void {
    this.container.innerHTML = `
      <div class="signature__split">
        <div class="signature__script">
          <div class="signature__line signature__line--script">INT. CAFE - DAY</div>
          <div class="signature__line signature__line--direction">She stares at her coffee, lost in thought.</div>
          <div class="signature__line signature__line--dialogue">I used to dream about this.</div>
        </div>
        <div class="signature__scene">
          <div class="signature__frame">
            <div class="signature__aspect"></div>
          </div>
        </div>
      </div>
    `;
  }

  private buildAudioSignal(): void {
    this.container.innerHTML = `
      <div class="signature__waveform">
        <canvas class="signature__canvas"></canvas>
        <div class="signature__controls">
          <button class="signature__play-btn">Play</button>
          <div class="signature__level">
            <span class="signature__label">-48 dBFS</span>
            <input type="range" min="0" max="100" value="75" class="signature__slider" />
            <span class="signature__label">0 dBFS</span>
          </div>
        </div>
      </div>
    `;
  }

  private buildLensLighting(): void {
    this.container.innerHTML = `
      <div class="signature__comparison">
        <div class="signature__before">
          <div class="signature__label">50mm f/1.4</div>
          <div class="signature__frame"></div>
        </div>
        <div class="signature__divider"></div>
        <div class="signature__after">
          <div class="signature__label">85mm f/2.8</div>
          <div class="signature__frame"></div>
        </div>
      </div>
    `;
  }

  private buildTimelineScrub(): void {
    this.container.innerHTML = `
      <div class="signature__timeline">
        <div class="signature__track">
          <div class="signature__handle"></div>
        </div>
        <div class="signature__clips">
          <div class="signature__clip"></div>
          <div class="signature__clip"></div>
          <div class="signature__clip"></div>
        </div>
      </div>
    `;
  }

  private buildSetDesignLayer(): void {
    this.container.innerHTML = `
      <div class="signature__layers">
        <div class="signature__layer" data-depth="1"></div>
        <div class="signature__layer" data-depth="2"></div>
        <div class="signature__layer" data-depth="3"></div>
      </div>
    `;
  }

  private buildCastingTape(): void {
    this.container.innerHTML = `
      <div class="signature__grid">
        <div class="signature__tape"></div>
        <div class="signature__tape"></div>
        <div class="signature__tape"></div>
        <div class="signature__tape"></div>
      </div>
    `;
  }

  private buildScoreToScene(): void {
    this.container.innerHTML = `
      <div class="signature__sync">
        <div class="signature__music"></div>
        <div class="signature__visual"></div>
      </div>
    `;
  }

  private buildFabricTexture(): void {
    this.container.innerHTML = `
      <div class="signature__swatches">
        <div class="signature__swatch"></div>
        <div class="signature__swatch"></div>
        <div class="signature__swatch"></div>
      </div>
    `;
  }

  private buildEquipmentExplorer(): void {
    this.container.innerHTML = `
      <div class="signature__gear">
        <div class="signature__item"></div>
        <div class="signature__item"></div>
        <div class="signature__item"></div>
      </div>
    `;
  }

  private buildInteractiveScript(): void {
    this.container.innerHTML = `
      <div class="signature__beats">
        <div class="signature__beat"></div>
        <div class="signature__beat"></div>
        <div class="signature__beat"></div>
      </div>
    `;
  }

  activate(): void {
    if (this.isActive) return;
    this.isActive = true;
    this.container.classList.add('signature--active');
  }

  deactivate(): void {
    this.isActive = false;
    this.container.classList.remove('signature--active');
  }

  destroy(): void {
    this.container.innerHTML = '';
    this.container.classList.remove('signature', `signature--${this.type.toLowerCase()}`);
  }
}