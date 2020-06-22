import { Component, Prop, h, Element } from '@stencil/core';
import Konva from 'konva';
import { Stage } from 'konva/types/Stage';
@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: false
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;
  @Element() wfContainerEl: HTMLElement;
  container: HTMLDivElement;
  stage: Stage;


  private prepareStage() {
    this.container = (this.wfContainerEl.getElementsByClassName('wf-container')[0] as HTMLDivElement);
    var width = 1000;
    var height = 1000;
    
    this.stage = new Konva.Stage({
      container: this.container,
      width: width,
      height: height,
    });
  }


  
  componentDidRender(){  
     
    this.prepareStage();
    var layer = new Konva.Layer();

    var rect2 = new Konva.Rect({
      x: 150,
      y: 40,
      width: 100,
      height: 50,
      fill: 'red',
      shadowBlur: 10,
      cornerRadius: 10,
    });
    layer.add(rect2);

    // add the layer to the stage
    this.stage.add(layer);
  }

  render() {
    return (
      <div class="wf-container"></div>    );
  }

}
