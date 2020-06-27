import { Status, _Status } from "./Status";
import { Group } from "konva/types/Group";
import { _Action } from "./Actions";

export interface _workflow{
   Status:{
        [key:string]:_Status
   }
}

export class Workflow {
    public data:_workflow;
    private main:Group;

    constructor(main:Group){
        this.main = main;
    }

    setData(data:any){
       this.data = {
           Status:{
               
             }
           };

       for(let key in data.Status){
            if (data.Status.hasOwnProperty(key)) {
                this.AddStatus(key,data.Status[key]);
            }
        }

    }
    AddNewStatus(){
            this.data.Status["Status "+ Object.keys(this.data.Status).length] = new Status("Status "+ Object.keys(this.data.Status).length);        
            if (this.data.Status.hasOwnProperty("Status "+ Object.keys(this.data.Status).length )) {
                let status =(this.data.Status["Status "+ Object.keys(this.data.Status).length] as Status).getStatus(this.main);
                
                this.main.add(status);
                this.main.getLayer().draw();
            }

    }    
    AddStatus(key:string,_status:_Status){
        this.data.Status[key]= new Status(key,_status) ;
    }

    draw(){
        this.main.destroyChildren();
        for(let key in this.data.Status){
            if (this.data.Status.hasOwnProperty(key)) {
                let status =(this.data.Status[key] as Status).getStatus(this.main);
                this.main.add(status);
            }
        }
        for(let fromKey in this.data.Status){
            if (this.data.Status.hasOwnProperty(fromKey)) {
                let from =(this.data.Status[fromKey] as Status).getStatus(this.main);
                (this.data.Status[fromKey] as Status).Actions.forEach(action => {
                    let to =(this.data.Status[action.ToStatus] as Status).getStatus(this.main);
                    Status.connectStatus(action.Name,from,to);
                });
            }
        }
        this.main.draw();
    }


    getData():_workflow{
        return this.data as _workflow;
    }
}
