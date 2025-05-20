export class Menus{

    //static menuDesdeJson( obj: Object ) {
     //   return new Menus(
     //       obj['IdMenu'],
     //       obj['IdPadre'],
     //       obj['Titulo'],
     //       obj['Estado'],
     //   );
    //}

constructor(
   public IdMenu:string,
   public IdPadre:string,
   public Titulo:string,
   public Estado:string   
){}

}