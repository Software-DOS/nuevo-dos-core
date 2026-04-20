import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { environment } from '../../../environments/environment';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { iGTHEmpleado } from '../../interface/igth-empleado';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {

  public usuario: any = "";
  public menu: any = [];
  public Imagen: string = ""; 
  
  // Rutas de imágenes
  IconoPerfil: string = environment.urlImagenes + 'assets/img/iconos/iconos mycollection/png/028-hombre-2.png';
  iconoPerfilPlaceholder: string = environment.urlImagenes + 'assets/img/iconos/iconos mycollection/png/001-empleado-de-oficina.png';
  
  // Subject para manejar unsubscribe
  private destroy$ = new Subject<void>();
  
  // Flags para evitar múltiples cargas
  private cargandoFoto: boolean = false;
  private fotoIntentoCarga: boolean = false;

  dropdownAbierto = false;

  IdEmpleadoActalSession: number | null = null;
  fotoPerfilUrl: string | null = '';
  nombreCompletoDisplayVar: string = ''; 

  constructor(
    private router: Router, 
    private menuService: MenuService,
    private gthEmpleadoService: GthEmpleadoService
  ) { }

  ngOnInit(): void {
    // Inicializar con imagen por defecto
    this.Imagen = this.IconoPerfil;
    
    // Configuración inicial de página
    this.setPageDataAttribute();
    
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setPageDataAttribute();
    });
    
    // Escuchar cambios en la foto de perfil
    this.gthEmpleadoService.fotoPerfilCambiada$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cambio) => {
          console.log('NavBar: Foto actualizada desde observable');
          this.Imagen = cambio.nuevaUrl || this.IconoPerfil;
        },
        error: (error) => {
          console.error('NavBar: Error en observable de foto:', error);
        }
      });
    
    // Obtener y procesar token
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      console.warn('NavBar: No se encontró token en sessionStorage');
      return;
    }
    
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      
      // Extraer datos del token
      const email = tokenData['email'] || 
                    tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                    tokenData['Email'];
      
      const idEmpleado = tokenData['IdEmpleado'] || 
                        tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      this.usuario = tokenData['NombresApellidos'] || email || 'Usuario';
      
      //Ponemos el ID del empleado en esta variable para buscar su informacion despues
      this.IdEmpleadoActalSession = idEmpleado;

      // Cargar foto de perfil
      const idFromService = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
      const idParaCargar = idFromService || idEmpleado;
      
      if (idParaCargar && !this.fotoIntentoCarga) {
        this.cargarFotoPerfilEmpleado(idParaCargar);
      }
      
      // Cargar menú del empleado
      if (!idEmpleado) {
        console.error('NavBar: No se pudo obtener IdEmpleado del token');
        return;
      }

      this.cargarDatosEmpleado();
      console.log("id del nav bar: ", idEmpleado);
      
      this.menuService.cargarMenu(idEmpleado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp: any) => {
            this.menu = resp['$values'] || resp || [];
          },
          error: (err) => {
            console.error('NavBar: Error al cargar menú:', err);
          }
        });

      
      
    } catch (error) {
      console.error('NavBar: Error al procesar token:', error);
    }
  }

  empleado: iGTHEmpleado | null = null;

  private setPageDataAttribute(): void {
    const currentUrl = this.router.url;
    let pageType = 'dashboard';
    
    if (currentUrl.includes('/lista-empleados') || currentUrl.includes('/admin-cv')) {
      pageType = 'profiles';
    } else if (currentUrl.includes('/empleado-cv')) {
      pageType = 'cv';
    } else if (currentUrl.includes('/lista-capacitaciones') || currentUrl.includes('/empleado-capacitaciones')) {
      pageType = 'training';
    } else if (currentUrl.includes('/lista-evaluaciones') || currentUrl.includes('/evaluacion') || currentUrl.includes('/lista-aplicantes')) {
      pageType = 'evaluation';
    } else if (currentUrl === '/' || currentUrl === '/home') {
      pageType = 'dashboard';
    }
    
    document.body.setAttribute('data-page', pageType);
  }

  /**
   * Carga la foto de perfil del empleado desde el backend
   */
  cargarFotoPerfilEmpleado(idEmpleado: number): void {
    // Evitar múltiples llamadas simultáneas
    if (this.cargandoFoto || this.fotoIntentoCarga) {
      console.log('NavBar: Ya se está cargando o ya se intentó cargar la foto');
      return;
    }

    if (!idEmpleado) {
      console.warn('NavBar: No se proporcionó ID de empleado válido');
      this.Imagen = this.IconoPerfil;
      return;
    }

    this.cargandoFoto = true;
    this.fotoIntentoCarga = true;

    this.gthEmpleadoService.obtenerFotoPerfil(idEmpleado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.cargandoFoto = false;

          if (response && response.fotoPerfilUrl) {
            const urlCompleta = this.gthEmpleadoService.construirUrlImagen(response.fotoPerfilUrl);
            console.log('NavBar: Foto cargada exitosamente');
            this.Imagen = urlCompleta;
          } else {
            console.log('NavBar: No hay foto de perfil, usando icono por defecto');
            this.Imagen = this.IconoPerfil;
          }
        },
        error: (error) => {
          this.cargandoFoto = false;
          console.error('NavBar: Error al cargar foto de perfil:', error);
          this.Imagen = this.IconoPerfil;
        }
      });
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
      ? environment.urlImagenes.slice(0, -1)
      : environment.urlImagenes;
  
    if (fotoPerfilUrl.startsWith('/')) {
      return `${baseUrl}${fotoPerfilUrl}`;
    }
  
    return `${baseUrl}/${fotoPerfilUrl}`;
  }  

  /**
   * Maneja errores de carga de imagen en el HTML
   */
  onImageError(event: Event, sexo: string) {
    const img = event.target as HTMLImageElement;
    img.src = this.construirUrlFoto('', sexo); // 👉 fuerza a usar fallback según sexo
  }


  cargarDatosEmpleado(): void {

    const idEmpleado = this.IdEmpleadoActalSession;
    

    console.log('[Perfil] ID empleado desde sesión:', idEmpleado);

    if (idEmpleado) {
      this.buscarEmpleadoPorId(idEmpleado);
    } else {
      console.warn('[Perfil] No se encontró ID de empleado en sesión');
    }
  }

  
  /**
   * Busca un empleado específico por ID
   * @param idEmpleado - ID del empleado a buscar
   */
  buscarEmpleadoPorId(idEmpleado: number): void {

  console.log('[Perfil] Buscando empleado por ID:', idEmpleado);

  this.gthEmpleadoService.MostrarConParametros(1, idEmpleado).subscribe({
    next: (empleado: any) => {

      console.log('[Perfil] Respuesta completa del backend:', empleado);

      const datosEmpleado = empleado?.$values?.[0];

      console.log('[Perfil] Primer registro de empleado:', datosEmpleado);

      if (datosEmpleado) {
        this.empleado = datosEmpleado;
        this.mapearDatosParaMostrar();
      } else {
        console.warn('[Perfil] No se encontró empleado con ese ID');
      }
    },
    error: (error) => {
      console.error('[Perfil] Error al buscar empleado:', error);
    }
  });
}


  private mapearDatosParaMostrar(): void {
    if (this.empleado) {
      const id = this.empleado.idEmpleado.toString();
      const nombre = this.empleado.nombre ?? '';
      const apellido = this.empleado.apellido ?? '';
      const sexo = this.empleado.sexo;

      this.nombreCompletoDisplayVar = `${nombre} ${apellido}`.trim();

      // ✅ AQUÍ se asigna la imagen
      this.fotoPerfilUrl = this.construirUrlFoto(id, sexo);

      console.log('[Perfil] URL final de la foto:', this.fotoPerfilUrl);

    }
  }




  logout(): void {
    this.dropdownAbierto = false;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigateByUrl("/login");
  }

  toggleDropdown(): void {
    this.dropdownAbierto = !this.dropdownAbierto;
    
    if (this.dropdownAbierto) {
      setTimeout(() => {
        this.adjustDropdownPosition();
      }, 10);
    }
  }

  private adjustDropdownPosition(): void {
    const dropdown = document.getElementById('profileMenu');
    const profileDropdown = dropdown?.parentElement;
    
    if (!dropdown || !profileDropdown) return;

    dropdown.classList.remove('dropdown-right', 'dropdown-left', 'dropdown-up');
    dropdown.offsetHeight;
    
    const dropdownRect = dropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const MARGIN = 10;

    if (dropdownRect.right > viewportWidth - MARGIN) {
      dropdown.classList.add('dropdown-left');
    }
    
    if (dropdownRect.left < MARGIN && !dropdown.classList.contains('dropdown-left')) {
      dropdown.classList.add('dropdown-right');
    }

    const updatedDropdownRect = dropdown.getBoundingClientRect();
    
    if (updatedDropdownRect.bottom > viewportHeight - MARGIN) {
      dropdown.classList.add('dropdown-up');
    }
    
    const finalRect = dropdown.getBoundingClientRect();
    if (finalRect.top < MARGIN && dropdown.classList.contains('dropdown-up')) {
      dropdown.classList.remove('dropdown-up');
      const availableHeight = viewportHeight - dropdownRect.bottom - MARGIN;
      dropdown.style.maxHeight = `${Math.max(200, availableHeight)}px`;
    }
  }

  private handleClickOutside = (event: Event) => {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown && !profileDropdown.contains(event.target as Node)) {
      this.dropdownAbierto = false;
    }
  }

  ngAfterViewInit(): void {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', () => {
      if (this.dropdownAbierto) {
        setTimeout(() => this.adjustDropdownPosition(), 10);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.handleClickOutside);
  }
}