import { Component, h,Element } from '@stencil/core';
import Konva from 'konva';
import { Stage } from 'konva/types/Stage';
import { Layer } from 'konva/types/Layer';
import { Group } from 'konva/types/Group';
import { Workflow, _workflow } from './models/Workflow';

@Component({
  tag: 'wf-editor',
  styleUrl: 'wf-editor.css',
  shadow: false,
})
export class WfEditor {

  @Element() wfContainerEl: HTMLElement;
  container: HTMLDivElement;
  stage: Stage;
  main: Group;
  mainLayer:Layer;
  backgroundLayer: Layer;
  stageWidth:number;
  stageHeight:number;
  scale:number;
  blockSnapSize:number = 20;
  button:HTMLButtonElement;
  workflow: Workflow;

  // private fitStageIntoParentContainer() {

  //   // now we need to fit stage into parent
  //   var containerWidth = this.container.offsetWidth;
  //   // to do this we need to scale the stage
  //   this.scale = containerWidth / this.stageWidth;
  //   this.stage.width(this.stageWidth * this.scale);
  //   this.stage.height(this.stageWidth * this.scale/2);
  //   this.scale=this.scale;
  //   this.stage.scale({ x: this.scale, y: this.scale });
  //   this.stage.draw();
  // }

  private getGridLayer(): Layer{
    let gridLayer = new Konva.Layer();
    let backgroundColor = '#F1F3F4';
    let gridColor = '#333333';
    let background = new Konva.Rect({
      x: 5,
      y: 5,
      width: this.stageWidth,
      height: this.stageHeight,
      fill: backgroundColor,
      stroke: gridColor,
      shadowBlur: 5,
    });

    gridLayer.add(background);
    
    let padding = this.blockSnapSize;
    for (var i = 0; i < this.stageWidth / padding; i++) {
          gridLayer.add(new Konva.Line({
            points: [5+Math.round(i * padding) + 0.5, 5, 5+Math.round(i * padding) + 0.5, 5+this.stageHeight],
            stroke: gridColor,
            strokeWidth: 0.5,
        }));}

    
    for (var j = 0; j < this.stageHeight / padding; j++) {
      gridLayer.add(new Konva.Line({
        points: [5, Math.round(j * padding)+5, 5+this.stageWidth, 5+Math.round(j * padding)],
        stroke: gridColor,
        strokeWidth: 0.5,
      }));
    }
    return gridLayer;

  }

  public save(){
    console.log(JSON.stringify(this.workflow.getData()));
  }

  private prepareStage() {
    this.container = (this.wfContainerEl.getElementsByClassName('wf-container')[0] as HTMLDivElement);
    this.button = (this.wfContainerEl.getElementsByTagName('button')[0] as HTMLButtonElement);

    this.stageWidth = 1000;
    this.stageHeight = 500;

    this.stage = new Konva.Stage({
      container: this.container,
      width: this.stageWidth+10,
      height: this.stageHeight+10,
    });
    this.backgroundLayer = this.getGridLayer();

    // add the layer to the stage
    this.stage.add(this.backgroundLayer);
  }

  componentDidRender(){  
     
    this.prepareStage();
    this.mainLayer = new Konva.Layer({name:'main-layer'});
    this.main = new Konva.Group({
      name:'main',
      x:10,
      y:10,
    });
    
    let data = {"Status":{"Start":{"name":"Start","Description":"Starting Status","Actions":[{"Name":"Save","Actors":["User"],"Events":[{"Name":"CreateRequest","Order":"1"}],"Options":{"Tags":[],"style":"Default"},"ToStatus":"Draft"},{"Name":"Submit","Actors":["User"],"Events":[{"Name":"CreateRequest","Order":"1"},{"Name":"SendEmail","Order":"2"}],"Options":{"Tags":["RequiresValidation"],"style":"Success"},"ToStatus":"Submitted"}],"Actors":["User"],"Options":{"code":"STR","style":"Default"},"Design":{"x":10,"y":10}},"Draft":{"name":"Draft","Description":"...","Actions":[{"Name":"Save","Actors":["User"],"Events":[{"Name":"UpdateRequest","Order":"1"}],"Options":{"Tags":[],"style":"Default"},"ToStatus":"Draft"},{"Name":"Submit","Actors":["User"],"Events":[{"Name":"UpdateRequest","Order":"1"},{"Name":"SendEmail","Order":"1"}],"Options":{"Tags":["RequiresValidation"],"style":"Success"},"ToStatus":"Submitted"}],"Actors":["User"],"Options":{"code":"DFT","style":"Default"},"Design":{"x":287,"y":142}},"Submitted":{"name":"Submitted","Description":"...","Actions":[{"Name":"Return","Actors":["Verifier"],"Events":[],"Options":{"Tags":["RequiresComment"],"style":"Warn"},"ToStatus":"Draft"},{"Name":"Verify","Actors":["Verifier"],"Events":[],"Options":{"Tags":[],"style":"Success"},"ToStatus":"Verified"}],"Actors":["User","Verifier"],"Options":{"code":"SMD","style":"Success"},"Design":{"x":7,"y":276}},"Verified":{"name":"Verified","Description":"...","Actions":[{"Name":"Approve","Actors":["Approver"],"Events":[],"Options":{"Tags":[],"style":"Success"},"ToStatus":"Approved"},{"Name":"Reject","Actors":["Approver"],"Events":[],"Options":{"Tags":["RequiresComment"],"style":"Danger"},"ToStatus":"Rejected"}],"Actors":["User","Verifier","Approver"],"Options":{"code":"VFD","style":"Default"},"Design":{"x":748,"y":284}},"Approved":{"name":"Approved","Description":"...","Actions":[],"Actors":["User","Verifier","Approver"],"Options":{"code":"APD","style":"Success"},"Design":{"x":697,"y":48}},"Rejected":{"name":"Rejected","Description":"...","Actions":[],"Actors":["User","Verifier","Approver"],"Options":{"code":"RJD","style":"Danger"},"Design":{"x":751,"y":411}}}};

    this.mainLayer.add(this.main);
    this.stage.add(this.mainLayer);
    this.workflow = new Workflow(this.main);
    this.workflow.setData(data);
    this.workflow.draw();
    
  }

  render() {
    return (
      
     <div><button onClick={(event: UIEvent)=>{this.workflow.AddNewStatus();}} class="btn">
     Add
   </button>
     <button onClick={(event: UIEvent)=>{this.save()}} class="btn">
      Save
    </button>
      <div class="wf-container"></div>
      </div>     );
  }


  
}
