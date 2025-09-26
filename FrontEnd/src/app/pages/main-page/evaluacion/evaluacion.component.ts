import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { GthCompetenciaService } from 'src/app/services/gth-competencia.service';
import { IGTHCompetenciaViewModel } from 'src/app/interface/ight-competencia';

import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { iGTHEmpleado } from '../../../interface/igth-empleado';

import { GthEvaluacionService } from '../../../services/gth-evaluacion.service';
import { Ievaluacion } from '../../../interface/ievaluacion';

import { alerts } from '../../../helpers/alerts';


// Dentro de tu componente (por encima de los métodos, en el scope de la clase)
interface NivelConCompetencia {
  idCompetencia: number;
  nivel: number;
  descripcion: string;
  nombreCompetencia: string;
  tipoCompetencia: string;
  valor: number;
  fecha: string;
  reconsiderar: number;
  calificacion: number;  
  calificacionFinal: number; 
}


@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent implements OnInit {

  constructor(
    private gthEmpleadoService:GthEmpleadoService,
    private gthEvaluacionServcie: GthEvaluacionService,
    private gthCompetenciaService: GthCompetenciaService) {       
  }

  ngOnInit(): void {

    this.cargarDatosEmpleado();

    this.cargarEvaluaciones();

    // Cargar las primeras 5 competencias al inicializar el componente
    this.cargarCompetenciasHojaRuta();
  }

  

  // Variable para el menú principal (superior)
  activeSection: string = 'hoja-ruta'; // Siempre inicia en hoja de ruta
  
  // Variable para el timeline (sub-menú cuando está en hoja-ruta)
  activeTimelineStep: string = 'Captura-Resultados'; // Por defecto la primera sección



  // Variable para almacenar la información del empleado
  empleado: iGTHEmpleado | null = null;
  cedulaEmpleado: string = ''; // Cambia esto por la cédula real del empleado}

  archivoSeleccionado: File | null = null;
  idEmpleadoActual: number | null = null;
  subiendoFoto: boolean = false;

  /* -------------  Campos para mostrar en el HTML  ----------  */
  // Variables para mostrar la información (solo lectura)

  fotoPerfilUrl: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Imagen por defecto
  fotoPerfilUrlDisplay: string = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  nombreCompletoDisplay: string = ''; 
  correoElectronicoDisplay: string = ''; 
  posicionDisplay: string = ''; 



  // nivelesCompetencia: IGTHNivelCompetenciaViewModel[] = []; // Niveles desde BD

  // declara la propiedad global del componente
  nivelesCompetencias: NivelConCompetencia[] = [];
  

  // Employee Information
  employee = {
  };

  //---------------------------   --------  BORRAR  ---- -----------------------  
  // Collaborator Information
  collaboratorInfo = {
    firstName: 'Juan Carlos',
    lastName: 'Rodríguez Martínez',
    position: 'Analista de Sistemas',
    supervisor: 'María Sánchez',
    startDate: '01/01/2020',
    department: 'Tecnología de la Información'
  };

  // Review Dates
  reviewDates = {
    evaluator: 'María Sánchez',
    period: 'Enero - Junio 2025',
    deadline: '30/06/2025'
  };

  //---------------------------------------------------------------------------------



  // Timeline Steps
  timelineSteps = [
    { 
      number: 1, 
      label: 'Captura de Resultados', 
      completed: true, 
      icon: 'fas fa-check',
      pngIcon: 'assets/img/iconos/iconos mycollection/png/062-reloj-de-arena.png',
      sectionId: 'Captura-Resultados'
    },
    { 
      number: 2, 
      label: 'Revisión Inicial', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/035-retroalimentacion-7.png',
      sectionId: 'Revision-Inicial'
    },
    { 
      number: 3, 
      label: 'Evaluación Intermedia', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/051-lista-de-verificacion.png',
      sectionId: 'Evaluacion-Intermedia'
    },
    { 
      number: 4, 
      label: 'Retroalimentación', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/028-grafico.png',
      sectionId: 'Retroalimentacion'
    },
    { 
      number: 5, 
      label: 'Cierre', 
      completed: false,
      pngIcon: 'assets/img/iconos/iconos mycollection/png/056-alcanzando-objetivos.png',
      sectionId: 'Cierre'
    }
  ];

  // Método para cambiar la sección activa
  onStepKeyDown(event: KeyboardEvent, step: any): void {
  // Activar con Enter o Espacio
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); // Prevenir scroll con espacio
    this.onStepClick(step);
  }
}
  // Método para el timeline (solo funciona cuando está en hoja-ruta)
  onStepClick(step: any): void {
    // Solo cambiar el step si estamos en la sección hoja-ruta
    if (this.activeSection === 'hoja-ruta') {
      this.activeTimelineStep = step.sectionId;
      console.log('Timeline step seleccionado:', this.activeTimelineStep);
    }
  }
  // Método para verificar si un step del timeline está activo
  isTimelineStepActive(sectionId: string): boolean {
    return this.activeSection === 'hoja-ruta' && this.activeTimelineStep === sectionId;
  }

  // Método para verificar si estamos en la sección hoja-ruta
  isInHojaRuta(): boolean {
    return this.activeSection === 'hoja-ruta';
  }




/*=======================================================================================
                            fUNCIONES PARA CARGAR INFO DE COLABORADOR
=========================================================================================*/

cargarDatosEmpleado(): void {

  console.log('Iniciando proceso de carga de informacion');
    // Obtener ID del empleado del sessionStorage
    const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
    
    if (idEmpleado) {
      this.idEmpleadoActual = idEmpleado;
      this.buscarEmpleadoPorId(2); //Probando
    } else {
      console.warn('No se encontró ID de empleado en sessionStorage, usando cédula de prueba');
      // Fallback: usar cédula hardcoded para testing
      // this.buscarEmpleadoPorId(2);
      // this.buscarEmpleadoPorCedula('1709876543');
    }
  }

/**
   * Busca un empleado específico por ID
   * @param idEmpleado - ID del empleado a buscar
   */
  buscarEmpleadoPorId(idEmpleado: number): void {
    console.log('Componente: ID enviado al servicio ->', idEmpleado);

    this.gthEmpleadoService.MostrarConParametros(1, idEmpleado).subscribe({
      next: (empleado: any) => {
        console.log('Respuesta del backend ->', empleado);

        const datosEmpleado = empleado?.$values?.[0];

        if (datosEmpleado) {
          this.empleado = datosEmpleado;
          this.mapearDatosParaMostrar();
        } else {
          console.warn('No se encontró empleado con el ID:', idEmpleado);
        }
      },
      error: (error) => {
        console.error('Error al buscar empleado por ID:', error);
      }
    });
  }

/**
   * Busca un empleado específico por cédula
   * @param cedula - Cédula del empleado a buscar
   */
  buscarEmpleadoPorCedula(cedula: string): void {
    console.log('Componente: cédula enviada al servicio ->', cedula); // 👈 AÑADIR ESTO

    this.gthEmpleadoService.BuscarPorCedula(cedula).subscribe({
      next: (empleado: any) => {
        console.log('Respuesta del backend ->', empleado);

        const datosEmpleado = empleado?.$values?.[0];

        if (datosEmpleado) {
          this.empleado = datosEmpleado;
          this.mapearDatosParaMostrar();
        } else {
          console.warn('No se encontró empleado con la cédula:', cedula);
        }
      },
      error: (error) => {
        console.error('Error al buscar empleado por cédula:', error);
      }
    });
  }

private async mapearDatosParaMostrar(): Promise<void>  {
    if (this.empleado) {
      // Guardar ID del empleado para usar en subida de fotos
      this.idEmpleadoActual = this.empleado.idEmpleado;

      // this.construirUrlFoto(this.empleado.fotoPerfilUrl || '', this.empleado.sexo || ''),

      this.nombreCompletoDisplay = `${this.empleado.nombre} ${this.empleado.apellido}`;
      this.correoElectronicoDisplay = this.empleado.correo || this.empleado.correoCorporativo;
      this.posicionDisplay = this.empleado.cargoActual;
      // this.areaDisplay = this.empleado.area;

    }
  }    

  construirUrlFoto(fotoPerfilUrl: string, sexo: string): string {
    // Normalizar sexo
    const sexoNormalizado = (sexo || '').toString().trim().toLowerCase();
  
    const defaultFemenino = 'assets/img/iconos/iconos mycollection/png/010-mujer-2.png';
    const defaultMasculino = 'assets/img/iconos/iconos mycollection/png/028-hombre-2.png';
    const defaultGenerico = 'assets/img/iconos/iconos mycollection/png/026-hombre-de-traje-y-corbata.png';
  
    // Determinar fallback según sexo
    const fallback = sexoNormalizado === 'femenino' || sexoNormalizado === 'f'
      ? defaultFemenino
      : sexoNormalizado === 'masculino' || sexoNormalizado === 'm'
        ? defaultMasculino
        : defaultGenerico;
  
    // Si no hay URL, usar fallback directamente
    if (!fotoPerfilUrl) return fallback;
  
    // Si es una URL completa (http/https), devolverla tal cual
    if (fotoPerfilUrl.startsWith('http://') || fotoPerfilUrl.startsWith('https://')) {
      return fotoPerfilUrl;
    }
  
    // Si es una ruta relativa, construir con el backend
    const baseUrl = environment.urlbackend.endsWith('/')
      ? environment.urlbackend.slice(0, -1)
      : environment.urlbackend;
  
    if (fotoPerfilUrl.startsWith('/')) {
      return `${baseUrl}${fotoPerfilUrl}`;
    }
  
    return `${baseUrl}/${fotoPerfilUrl}`;
  }
  
  
  onImageError(event: Event, sexo: string) {
    const img = event.target as HTMLImageElement;
    img.src = this.construirUrlFoto('', sexo); // 👉 fuerza a usar fallback según sexo
  }
  



/*=======================================================================================
                            fUNCIONES PARA CARGAR INFO DE EVALUACION
=========================================================================================*/

  cargarEvaluaciones(): void {
    const idEmpleado = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();

    if (idEmpleado) {
      this.idEmpleadoActual = 2; // pruebas
      const anio = 2026;

      this.gthEvaluacionServcie.MostrarEvaluacionesPorEmpleadoyAnio(this.idEmpleadoActual, anio).subscribe({
        next: (response: any) => {
          let evaluacionesData = response;
          if (response && response.$values) evaluacionesData = response.$values;

          if (evaluacionesData && evaluacionesData.length > 0) {
            const idEvaluacion = evaluacionesData[0].idEvaluacion;

            // inicializamos la colección
            this.nivelesCompetencias = [];

            this.gthCompetenciaService.obtenerAsignacionCompetenciaPorIdEvaluacion(idEvaluacion).subscribe({
              next: (respAsigCompetencias: any) => {
                let asignacionesCompetenciasData = respAsigCompetencias;
                if (respAsigCompetencias && respAsigCompetencias.$values) {
                  asignacionesCompetenciasData = respAsigCompetencias.$values;
                }

                asignacionesCompetenciasData.forEach((comp: any) => {
                  const idNivelCompetencia = comp.idNivelCompetencia;

                  this.gthCompetenciaService.mostrarNivelCompetencias(1, idNivelCompetencia).subscribe({
                    next: (respNivelCompetencias: any) => {
                      let nivelesCompetenciasData = respNivelCompetencias;
                      if (respNivelCompetencias && respNivelCompetencias.$values) {
                        nivelesCompetenciasData = respNivelCompetencias.$values;
                      }

                      nivelesCompetenciasData.forEach((nivel: any) => {
                        this.gthCompetenciaService.mostrarCompetencias(1, nivel.idCompetencia).subscribe({
                          next: (respCompetencia: any) => {
                            let competenciaData = respCompetencia;
                            if (respCompetencia && respCompetencia.$values) {
                              competenciaData = respCompetencia.$values;
                            }

                            if (competenciaData.length > 0) {
                              const competencia = competenciaData[0];

                              const combinado: NivelConCompetencia = {
                                idCompetencia: nivel.idCompetencia,
                                nivel: nivel.nivel,
                                descripcion: nivel.descripcion,
                                nombreCompetencia: competencia.nombreCompetencia,
                                tipoCompetencia: competencia.tipoCompetencia,
                                valor:0,
                                fecha:'',
                                reconsiderar: 0,
                                calificacion: 0,
                                calificacionFinal: 0
                              };

                              this.nivelesCompetencias.push(combinado);

                              // ✅ Log final para verificar la información combinada
                              console.log('✅ Competencia con niveles:', combinado);
                            }
                          },
                          error: (error) => console.error('Error al consultar competencia:', error)
                        });
                      });
                    },
                    error: (error) => console.error('Error al consultar niveles de competencias:', error)
                  });
                });
              },
              error: (error) => console.error('Error al consultar competencias asignadas:', error)
            });
          } else {
            console.warn('⚠️ No se encontró ninguna evaluación para este empleado y año.');
          }
        },
        error: (error) => console.error('Error al consultar evaluaciones:', error)
      });
    } else {
      console.warn('No se encontró ID de empleado en sessionStorage');
    }
  }




  // Objectives (KPIs)
  objectives = [
    {
      name: 'Entrega de Proyectos',
      weight: '40%',
      startDate: '01/01/2025',
      endDate: '30/06/2025',
      description: 'Completar entregables en tiempo y forma.'
    },
    {
      name: 'Reducción de Errores',
      weight: '30%',
      startDate: '01/01/2025',
      endDate: '30/06/2025',
      description: 'Reducir errores de software en un 20%.'
    }
  ];

  // Variable para controlar el estado de carga
  loadingCompetencies: boolean = false;

  // Inicializamos los espacios para los Objetivos del empleado - se mantienen en memoria durante la sesión
  objetivos = [
    {
      id: 1,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 2,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 3,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 4,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 5,
      texto: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    }
  ];

  // Competencias del empleado - se mantienen en memoria durante la sesión (similar a objetivos)
  competencias = [
    {
      id: 1,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 2,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 3,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 4,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    },
    {
      id: 5,
      name: '',
      valor: null as number | null,
      fecha: '',
      reconsiderar: null as number | null,
      calificacionFinal: null as number | null,
      isEditing: false
    }
  ];

  // competencias: { idCompetencia: number, tipo: string, NombreCompetencia: string }[] = [];  
  // competenciasFiltradas: { idCompetencia: number, tipo: string, NombreCompetencia: string }[] = [];
  // tiposCompetencia: string[] = [];

  // tipoCompetencia: string | null = null;
  // competenciaSeleccionada: string | null = null;
  // nivelSeleccionado: string | null = null;

  // // Agregar estas variables (mantén las existentes)
  // nivelesCompetencia: IGTHNivelCompetenciaViewModel[] = []; // Niveles desde BD
  // nivelesDisponibles: string[] = []; // Niveles filtrados para mostrar en el select




  /**
   * Carga las primeras 5 competencias desde el backend para poblar las competencias fijas
   * Solo carga los nombres si las competencias están vacías
   */
  cargarCompetenciasHojaRuta(): void {
    console.log('🔍 Verificando competencias fijas:', this.competencias);
    
    // Si ya hay nombres en las competencias fijas, no volver a cargar
    if (this.competencias[0].name !== '') {
      console.log('✅ Competencias fijas ya tienen nombres, preservando valores existentes');
      return;
    }

    console.log('🚀 Iniciando carga de nombres de competencias...');
    this.loadingCompetencies = true;
    
    this.gthCompetenciaService.obtenerPrimeras5Competencias()
      .subscribe({
        next: (competencias: IGTHCompetenciaViewModel[]) => {
          console.log('📊 Competencias obtenidas del servicio:', competencias);
          
          // Poblar solo los nombres en las competencias fijas
          competencias.forEach((comp, index) => {
            if (index < this.competencias.length) {
              this.competencias[index].name = comp.nombreCompetencia || `Competencia ${index + 1}`;
              // Mantener los valores existentes (valor, fecha, reconsiderar)
            }
          });
          
          this.loadingCompetencies = false;
          console.log('✅ Competencias fijas pobladas:', this.competencias);
        },
        error: (error) => {
          console.error('❌ Error al cargar competencias:', error);
          this.loadingCompetencies = false;
          
          // En caso de error, usar nombres por defecto
          this.competencias.forEach((comp, index) => {
            if (comp.name === '') {
              comp.name = `Competencia ${index + 1}`;
            }
          });
          
          console.log('🔄 Usando nombres por defecto por error');
        }
      });
  }

  /**
   * Actualiza el texto de un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Nuevo texto del objetivo (puede ser Event o string)
   */
  actualizarTextoObjetivo(index: number, valor: any): void {
    let nuevoTexto: string;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoTexto = (valor.target as HTMLInputElement).value;
    } else {
      // Es un valor directo (ngModelChange)
      nuevoTexto = valor;
    }
    
    if (index >= 0 && index < this.objetivos.length) {
      this.objetivos[index].texto = nuevoTexto;
      console.log(`📝 Objetivo ${index + 1} actualizado:`, this.objetivos[index]);
    }
  }

  /**
   * Actualiza el valor numérico de un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Nuevo valor numérico (puede ser Event o number)
   */
  actualizarValorObjetivo(index: number, valor: any): void {
    let nuevoValor: number;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoValor = parseInt((valor.target as HTMLInputElement).value, 10);
    } else {
      // Es un valor directo (ngModelChange)
      nuevoValor = parseInt(valor, 10);
    }
    
    if (index >= 0 && index < this.objetivos.length) {
      // Validar que el valor esté entre 0 y 100
      if (!isNaN(nuevoValor) && nuevoValor >= 0 && nuevoValor <= 100) {
        this.objetivos[index].valor = nuevoValor;
        console.log(`📊 Valor del objetivo ${index + 1} actualizado:`, this.objetivos[index]);
      }
    }
  }

  /**
   * Actualiza la fecha de un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Nueva fecha (puede ser Event o string)
   */
  actualizarFechaObjetivo(index: number, valor: any): void {
    let nuevaFecha: string;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevaFecha = (valor.target as HTMLInputElement).value;
    } else {
      // Es un valor directo (ngModelChange)
      nuevaFecha = valor;
    }
    
    if (index >= 0 && index < this.objetivos.length) {
      this.objetivos[index].fecha = nuevaFecha;
      console.log(`📅 Fecha del objetivo ${index + 1} actualizada:`, this.objetivos[index]);
    }
  }

  /**
   * Actualiza el nombre de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param valor - Nuevo nombre (puede ser Event o string)
   */
  actualizarNombreCompetenciaFija(index: number, valor: any): void {
    let nuevoNombre: string;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoNombre = (valor.target as HTMLInputElement).value;
    } else {
      // Es un string directo
      nuevoNombre = String(valor);
    }

    if (index >= 0 && index < this.competencias.length) {
      this.competencias[index].name = nuevoNombre;
      console.log(`📝 Nombre competencia ${index + 1}:`, nuevoNombre, this.competencias[index]);
    }
  }

  /**
   * Actualiza el valor numérico de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param valor - Valor numérico (puede ser Event o number)
   */
  actualizarValorCompetenciaFija(index: number, valor: any): void {
    let nuevoValor: number;
    
    if (valor && typeof valor === 'object' && valor.target) {
      // Es un evento
      nuevoValor = Number((valor.target as HTMLInputElement).value);
    } else {
      // Es un número directo
      nuevoValor = Number(valor);
    }

    if (index >= 0 && index < this.competencias.length) {
      // Validar que el valor esté entre 0 y 100
      if (!isNaN(nuevoValor) && nuevoValor >= 0 && nuevoValor <= 100) {
        this.competencias[index].valor = nuevoValor;
        console.log(`📊 Valor competencia ${index + 1}:`, nuevoValor, this.competencias[index]);
      }
    }
  }

  /**
   * Actualiza la fecha de una competencia específica (array fijo)
   * @param index - Índice de la competencia (0-4)
   * @param fecha - Nueva fecha (puede ser Event o string)
   */
  actualizarFechaCompetenciaFija(index: number, fecha: any): void {
    let nuevaFecha: string;
    
    if (fecha && typeof fecha === 'object' && fecha.target) {
      // Es un evento
      nuevaFecha = (fecha.target as HTMLInputElement).value;
    } else {
      // Es una fecha directa
      nuevaFecha = String(fecha);
    }

    if (index >= 0 && index < this.competencias.length) {
      this.competencias[index].fecha = nuevaFecha;
      console.log(`📅 Fecha competencia ${index + 1}:`, nuevaFecha, this.competencias[index]);
    }
  }

  /**
   * Calcula el porcentaje total basado en los valores de los objetivos
   * @returns Porcentaje total promedio
   */
  calcularPorcentajeTotal(): number {
    const objetivosConValor = this.objetivos.filter(obj => obj.valor !== null && obj.valor > 0);
    if (objetivosConValor.length === 0) return 0;
    
    const suma = objetivosConValor.reduce((acc, obj) => acc + (obj.valor || 0), 0);
    const promedio = suma / objetivosConValor.length;
    
    return Math.round(promedio);
  }

  /**
   * Obtiene todos los objetivos como un objeto para debugging
   * @returns Array con todos los objetivos actuales
   */
  obtenerEstadoObjetivos(): any[] {
    return this.objetivos.map(obj => ({
      id: obj.id,
      texto: obj.texto,
      valor: obj.valor,
      fecha: obj.fecha,
      reconsiderar: obj.reconsiderar,
      completado: obj.texto && obj.valor && obj.fecha
    }));
  }

  /**
   * Determina si los campos de objetivos deben estar deshabilitados
   * Solo son editables en la etapa "Captura-Resultados"
   * @returns true si los campos deben estar deshabilitados
   */
  sonCamposObjetivosDeshabilitados(): boolean {
    return this.activeTimelineStep !== 'Captura-Resultados';
  }

  /**
   * Actualiza el estado de "reconsiderar" para un objetivo específico
   * @param index - Índice del objetivo (0-4)
   * @param valor - Valor numérico para reconsiderar
   */
  actualizarReconsiderarObjetivo(index: number, valor: number): void {
    if (index >= 0 && index < this.objetivos.length) {
      // Validar que el valor esté entre 0 y 100
      if (!isNaN(valor) && valor >= 0 && valor <= 100) {
        this.objetivos[index].reconsiderar = valor;
        console.log(`🔄 Reconsiderar objetivo ${index + 1}:`, valor, this.objetivos[index]);
      }
    }
  }

  /**
   * Verifica si el campo "reconsiderar" debe estar visible
   * Solo está disponible en "Revision-Inicial"
   * @returns true si el campo debe estar visible
   */
  esReconsiderarVisible(): boolean {
    return this.activeTimelineStep === 'Revision-Inicial';
  }

  // showSection(targetId: string): void {
  //   this.activeSection = targetId;
  // }
  // Método para el menú principal
  showSection(targetId: string): void {
    this.activeSection = targetId;
    
    // Si selecciona "hoja-ruta", resetea al primer paso del timeline
    if (targetId === 'hoja-ruta') {
      this.activeTimelineStep = 'Captura-Resultados';
    }
    
    console.log('Sección principal activa:', this.activeSection);
    console.log('Step del timeline activo:', this.activeTimelineStep);
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('profileMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  logout(): void {
    // Logout logic will be implemented later
    console.log('Logout clicked');
  }

}
