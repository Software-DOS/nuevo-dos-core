import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { GthEmpleadoService } from 'src/app/services/gthempleado.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {

  public usuario: any = "";
  public menu: any = [];
  public Imagen: string = ""; 
  
  // ✅ CAMBIO: Ruta corregida sin espacios
  IconoPerfil: string = 'assets/img/iconos/mycollection/png/028-hombre-2.png';
  iconoPerfilPlaceholder: string = 'assets/img/iconos/mycollection/png/001-empleado-de-oficina.png';
  
  // ✅ NUEVO: Subject para manejar unsubscribe
  private destroy$ = new Subject<void>();
  
  // ✅ NUEVO: Flag para evitar múltiples cargas simultáneas
  private cargandoFoto: boolean = false;
  
  // ✅ NUEVO: Flag para verificar si ya se intentó cargar la foto
  private fotoIntentoCarga: boolean = false;

  dropdownAbierto = false;

  constructor(
    private router: Router, 
    private menuService: MenuService,
    private gthEmpleadoService: GthEmpleadoService
  ) { }

  ngOnInit(): void {
    // Inicializar con imagen por defecto
    this.Imagen = this.IconoPerfil;
    
    // ════════════════════════════════════════════════════════════════════
    // 🎨 CONFIGURACIÓN INICIAL DE PÁGINA
    // ════════════════════════════════════════════════════════════════════
    this.setPageDataAttribute();
    
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setPageDataAttribute();
    });
    
    // ════════════════════════════════════════════════════════════════════
    // 📸 ESCUCHAR CAMBIOS EN LA FOTO DE PERFIL (UNA SOLA VEZ)
    // ════════════════════════════════════════════════════════════════════
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
    
    // ════════════════════════════════════════════════════════════════════
    // 🔐 OBTENER Y PROCESAR TOKEN
    // ════════════════════════════════════════════════════════════════════
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
      
      // ════════════════════════════════════════════════════════════════════
      // 📸 CARGAR FOTO DE PERFIL (UNA SOLA VEZ)
      // ════════════════════════════════════════════════════════════════════
      const idFromService = this.gthEmpleadoService.obtenerIdGthEmpleadoDesdeSession();
      const idParaCargar = idFromService || idEmpleado;
      
      // ✅ CAMBIO: Solo cargar si no se ha intentado antes
      if (idParaCargar && !this.fotoIntentoCarga) {
        this.cargarFotoPerfilEmpleado(idParaCargar);
      }
      
      // ════════════════════════════════════════════════════════════════════
      // 📋 CARGAR MENÚ DEL EMPLEADO
      // ════════════════════════════════════════════════════════════════════
      if (!idEmpleado) {
        console.error('NavBar: No se pudo obtener IdEmpleado del token');
        return;
      }
      
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
   * ✅ OPTIMIZADO: Carga la foto de perfil solo una vez
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

  /**
   * ✅ NUEVO: Maneja errores de carga de imagen en el HTML
   */
  onImagenPerfilError(event: any): void {
    console.warn('NavBar: Error al cargar imagen, usando fallback');
    // Evitar bucle infinito de errores
    if (event.target.src !== this.iconoPerfilPlaceholder) {
      event.target.src = this.iconoPerfilPlaceholder;
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
    // ✅ IMPORTANTE: Limpiar subscripciones
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.handleClickOutside);
  }
}
`