// Variables globales para Three.js
let scene, camera, renderer, controls;
let currentComponent = null;
let componentMeshes = {};
let animationSpeed = 1;
let lightIntensity = 1;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Laboratorio Virtual 3D cargado exitosamente');
    
    // Inicializar funcionalidades
    initialize3D();
    initializeEventListeners();
    initializeAnimations();
    initializeSimulator();
    initializeTutorials();
    initializePractices();
    
    console.log('✅ Todas las funcionalidades 3D han sido activadas');
});


// Crear modelos 3D básicos
function createBasicModels() {
    // CPU
    const cpuGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const cpuMaterial = new THREE.MeshPhongMaterial({ color: 0x2563eb });
    const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
    cpu.position.set(-2, 0, 0);
    scene.add(cpu);
    componentMeshes.cpu = cpu;
    
    // RAM
    const ramGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.3);
    const ramMaterial = new THREE.MeshPhongMaterial({ color: 0x1d4ed8 });
    const ram = new THREE.Mesh(ramGeometry, ramMaterial);
    ram.position.set(0, 0, 0);
    scene.add(ram);
    componentMeshes.ram = ram;
    
    // GPU
    const gpuGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.8);
    const gpuMaterial = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
    const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
    gpu.position.set(2, 0, 0);
    scene.add(gpu);
    componentMeshes.gpu = gpu;
    
    // Agregar etiquetas
    addLabels();
}

// Agregar etiquetas a los componentes
function addLabels() {
    const loader = new THREE.FontLoader();
    // Por simplicidad, usamos geometrías básicas como etiquetas
    Object.keys(componentMeshes).forEach(key => {
        const labelGeometry = new THREE.PlaneGeometry(0.5, 0.2);
        const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 0.5, 0);
        componentMeshes[key].add(label);
    });
}

// Loop de animación
function animate() {
    requestAnimationFrame(animate);
    
    // Rotar componentes
    Object.values(componentMeshes).forEach(mesh => {
        mesh.rotation.y += 0.01 * animationSpeed;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

// Inicializar event listeners
function initializeEventListeners() {
    // Botones de control 3D
    document.getElementById('rotate-left')?.addEventListener('click', () => rotateCamera('left'));
    document.getElementById('rotate-right')?.addEventListener('click', () => rotateCamera('right'));
    document.getElementById('zoom-in')?.addEventListener('click', () => zoomCamera('in'));
    document.getElementById('zoom-out')?.addEventListener('click', () => zoomCamera('out'));
    
    // Controles del laboratorio
    document.getElementById('view-mode')?.addEventListener('change', handleViewModeChange);
    document.getElementById('animation-speed')?.addEventListener('input', handleAnimationSpeedChange);
    document.getElementById('light-intensity')?.addEventListener('input', handleLightIntensityChange);
    
    // Selector de componentes
    document.querySelectorAll('.component-item').forEach(item => {
        item.addEventListener('click', () => selectComponent(item.dataset.component));
    });
    
    // Botones de acción
    document.getElementById('btn-explode')?.addEventListener('click', explodeComponent);
    document.getElementById('btn-cut')?.addEventListener('click', cutComponent);
    document.getElementById('btn-measure')?.addEventListener('click', measureComponent);
    document.getElementById('btn-animate')?.addEventListener('click', animateComponent);
    
    // Botones principales
    document.getElementById('btn-explorar-3d')?.addEventListener('click', start3DExploration);
    document.getElementById('btn-tutorial')?.addEventListener('click', showTutorial);
}

// Funciones de control de cámara
function rotateCamera(direction) {
    const angle = direction === 'left' ? 0.5 : -0.5;
    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    controls.update();
}

function zoomCamera(direction) {
    const factor = direction === 'in' ? 0.9 : 1.1;
    camera.position.multiplyScalar(factor);
    controls.update();
}

// Manejo de cambios en controles
function handleViewModeChange(event) {
    const mode = event.target.value;
    switch(mode) {
        case 'wireframe':
            Object.values(componentMeshes).forEach(mesh => {
                mesh.material.wireframe = true;
            });
            break;
        case 'solid':
            Object.values(componentMeshes).forEach(mesh => {
                mesh.material.wireframe = false;
            });
            break;
        case 'transparent':
            Object.values(componentMeshes).forEach(mesh => {
                mesh.material.transparent = true;
                mesh.material.opacity = 0.7;
            });
            break;
        case 'xray':
            Object.values(componentMeshes).forEach(mesh => {
                mesh.material.transparent = true;
                mesh.material.opacity = 0.3;
            });
            break;
    }
}

function handleAnimationSpeedChange(event) {
    animationSpeed = parseFloat(event.target.value);
    document.getElementById('speed-value').textContent = event.target.value + 'x';
}

function handleLightIntensityChange(event) {
    lightIntensity = parseFloat(event.target.value);
    document.getElementById('light-value').textContent = Math.round(event.target.value * 100) + '%';
    
    // Actualizar intensidad de luz
    scene.children.forEach(child => {
        if (child.isLight) {
            child.intensity = lightIntensity;
        }
    });
}

// Selección de componentes
function selectComponent(componentType) {
    // Remover selección previa
    document.querySelectorAll('.component-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Seleccionar nuevo componente
    const selectedItem = document.querySelector(`[data-component="${componentType}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
        currentComponent = componentType;
        updateComponentInfo(componentType);
        highlightComponent(componentType);
    }
}

// Actualizar información del componente
function updateComponentInfo(componentType) {
    const infoContainer = document.getElementById('component-info');
    const componentInfo = {
        cpu: {
            name: 'Unidad Central de Procesamiento',
            description: 'El cerebro de la computadora que ejecuta todas las operaciones',
            specs: 'Velocidad: Hasta 5 GHz, Núcleos: Múltiples, Arquitectura: x86-64'
        },
        ram: {
            name: 'Memoria de Acceso Aleatorio',
            description: 'Almacena temporalmente datos e instrucciones para el CPU',
            specs: 'Velocidad: Hasta 6400 MT/s, Capacidad: Hasta 128 GB, Tipo: DDR5'
        },
        gpu: {
            name: 'Unidad de Procesamiento Gráfico',
            description: 'Procesa gráficos y cálculos paralelos complejos',
            specs: 'Memoria: Hasta 24 GB GDDR6X, Ray Tracing: Sí, DLSS: Sí'
        }
    };
    
    const info = componentInfo[componentType];
    if (info && infoContainer) {
        infoContainer.innerHTML = `
            <h5>${info.name}</h5>
            <p>${info.description}</p>
            <div class="specs">
                <strong>Especificaciones:</strong><br>
                ${info.specs}
            </div>
        `;
    }
}

// Resaltar componente seleccionado
function highlightComponent(componentType) {
    // Remover resaltado previo
    Object.values(componentMeshes).forEach(mesh => {
        mesh.material.emissive.setHex(0x000000);
    });
    
    // Resaltar componente seleccionado
    if (componentMeshes[componentType]) {
        componentMeshes[componentType].material.emissive.setHex(0x3b82f6);
    }
}

// Funciones de acción
function explodeComponent() {
    if (!currentComponent) return;
    
    const mesh = componentMeshes[currentComponent];
    if (mesh) {
        // Crear efecto de explosión
        const originalPosition = mesh.position.clone();
        const targetPosition = originalPosition.clone().multiplyScalar(1.5);
        
        new TWEEN.Tween(mesh.position)
            .to(targetPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
}

function cutComponent() {
    if (!currentComponent) return;
    
    const mesh = componentMeshes[currentComponent];
    if (mesh) {
        // Simular corte mostrando interior
        mesh.material.transparent = true;
        mesh.material.opacity = 0.5;
        
        // Crear geometría interna
        const internalGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const internalMaterial = new THREE.MeshPhongMaterial({ color: 0x1e293b });
        const internal = new THREE.Mesh(internalGeometry, internalMaterial);
        internal.position.copy(mesh.position);
        scene.add(internal);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            scene.remove(internal);
            mesh.material.opacity = 1;
        }, 3000);
    }
}

function measureComponent() {
    if (!currentComponent) return;
    
    const mesh = componentMeshes[currentComponent];
    if (mesh) {
        // Mostrar dimensiones
        const dimensions = mesh.geometry.parameters;
        alert(`Dimensiones del ${currentComponent.toUpperCase()}:\nAncho: ${dimensions.width}\nAlto: ${dimensions.height}\nProfundidad: ${dimensions.depth}`);
    }
}

function animateComponent() {
    if (!currentComponent) return;
    
    const mesh = componentMeshes[currentComponent];
    if (mesh) {
        // Animación de rotación rápida
        new TWEEN.Tween(mesh.rotation)
            .to({ y: mesh.rotation.y + Math.PI * 4 }, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }
}

// Funciones principales
function start3DExploration() {
    alert('🚀 Iniciando exploración 3D del laboratorio virtual...');
    // Aquí se podría abrir una nueva vista o modal con más funcionalidades
}

function showTutorial() {
    alert('📚 Abriendo tutorial interactivo...');
    // Aquí se podría mostrar un modal o navegar a la sección de tutoriales
}

// Inicialización de animaciones
function initializeAnimations() {
    // Animación de contadores
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        animateCounter(stat, target);
    });
}

// Función para animar contadores
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

// Inicialización del simulador
function initializeSimulator() {
    const startBtn = document.getElementById('btn-start-assembly');
    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');
    const autoBtn = document.getElementById('btn-auto-assembly');
    
    if (startBtn) startBtn.addEventListener('click', startAssembly);
    if (prevBtn) prevBtn.addEventListener('click', previousStep);
    if (nextBtn) nextBtn.addEventListener('click', nextStep);
    if (autoBtn) autoBtn.addEventListener('click', autoAssembly);
}

// Funciones del simulador
function startAssembly() {
    document.getElementById('btn-start-assembly').disabled = true;
    document.getElementById('btn-prev-step').disabled = false;
    document.getElementById('btn-next-step').disabled = false;
    
    updateStep(1);
    updateProgress(12.5);
}

function previousStep() {
    const currentStep = parseInt(document.getElementById('current-step').textContent);
    if (currentStep > 1) {
        updateStep(currentStep - 1);
        updateProgress((currentStep - 1) * 12.5);
    }
}

function nextStep() {
    const currentStep = parseInt(document.getElementById('current-step').textContent);
    if (currentStep < 8) {
        updateStep(currentStep + 1);
        updateProgress(currentStep * 12.5);
    }
}

function autoAssembly() {
    let step = 1;
    const interval = setInterval(() => {
        updateStep(step);
        updateProgress(step * 12.5);
        step++;
        
        if (step > 8) {
            clearInterval(interval);
            completeAssembly();
        }
    }, 1000);
}

function updateStep(step) {
    document.getElementById('current-step').textContent = step;
    
    // Actualizar instrucciones según el paso
    const instructions = [
        'Preparar el gabinete y verificar compatibilidad',
        'Instalar la placa base en el gabinete',
        'Instalar el CPU en el socket de la placa base',
        'Instalar el sistema de enfriamiento del CPU',
        'Instalar la memoria RAM en los slots correspondientes',
        'Instalar la tarjeta gráfica en el slot PCIe',
        'Conectar la fuente de poder y cablear todos los componentes',
        'Verificar conexiones y realizar prueba de encendido'
    ];
    
    document.getElementById('step-content').innerHTML = `<p>${instructions[step - 1]}</p>`;
    
    // Marcar componente como completado
    const componentList = document.querySelectorAll('.component-check');
    if (componentList[step - 1]) {
        componentList[step - 1].classList.add('completed');
    }
}

function updateProgress(percentage) {
    document.getElementById('step-progress').style.width = percentage + '%';
}

function completeAssembly() {
    alert('🎉 ¡Ensamblaje completado exitosamente!');
    document.getElementById('btn-start-assembly').disabled = false;
    document.getElementById('btn-prev-step').disabled = true;
    document.getElementById('btn-next-step').disabled = true;
}

// Inicialización de tutoriales
function initializeTutorials() {
    document.querySelectorAll('.tutorial-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tutorial = this.closest('.tutorial-card').dataset.tutorial;
            startTutorial(tutorial);
        });
    });
}

function startTutorial(tutorialType) {
    alert(`📚 Iniciando tutorial: ${tutorialType}`);
    // Aquí se implementaría la lógica específica de cada tutorial
}

// Inicialización de prácticas
function initializePractices() {
    // Tabs de práctica
    document.querySelectorAll('.practice-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.practice-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadPractice(this.dataset.practice);
        });
    });
    
    // Herramientas de práctica
    document.getElementById('tool-label')?.addEventListener('click', () => activateTool('label'));
    document.getElementById('tool-highlight')?.addEventListener('click', () => activateTool('highlight'));
    document.getElementById('tool-measure')?.addEventListener('click', () => activateTool('measure'));
    document.getElementById('tool-rotate')?.addEventListener('click', () => activateTool('rotate'));
    
    // Botón de envío
    document.getElementById('btn-submit-practice')?.addEventListener('click', submitPractice);
}

function loadPractice(level) {
    const practices = {
        basic: {
            title: 'Identificación de Componentes',
            description: 'Identifica y etiqueta los diferentes componentes de una computadora',
            objectives: ['Reconocer componentes principales', 'Entender la función de cada parte', 'Identificar conexiones entre componentes']
        },
        intermediate: {
            title: 'Análisis de Arquitectura',
            description: 'Analiza la arquitectura interna de los componentes principales',
            objectives: ['Comprender la jerarquía de memoria', 'Analizar el flujo de datos', 'Identificar cuellos de botella']
        },
        advanced: {
            title: 'Optimización de Rendimiento',
            description: 'Optimiza la configuración para máximo rendimiento',
            objectives: ['Overclocking seguro', 'Configuración de memoria', 'Optimización de refrigeración']
        }
    };
    
    const practice = practices[level];
    if (practice) {
        document.getElementById('practice-title').textContent = practice.title;
        document.getElementById('practice-description').textContent = practice.description;
        
        const objectivesList = document.getElementById('practice-objectives');
        objectivesList.innerHTML = practice.objectives.map(obj => `<li>${obj}</li>`).join('');
    }
}

function activateTool(tool) {
    alert(`🛠️ Herramienta activada: ${tool}`);
    // Aquí se implementaría la lógica específica de cada herramienta
}

function submitPractice() {
    // Simular evaluación
    const score = Math.floor(Math.random() * 40) + 60; // Puntuación entre 60-100
    const time = '05:23'; // Tiempo simulado
    
    document.getElementById('practice-score').textContent = score + '/100';
    document.getElementById('practice-time').textContent = time;
    
    // Generar retroalimentación
    let feedback = '';
    if (score >= 90) {
        feedback = '¡Excelente trabajo! Has demostrado un dominio completo del tema.';
    } else if (score >= 80) {
        feedback = 'Muy buen trabajo. Solo algunos detalles menores por mejorar.';
    } else if (score >= 70) {
        feedback = 'Buen trabajo. Revisa los conceptos que no quedaron claros.';
    } else {
        feedback = 'Necesitas repasar algunos conceptos fundamentales.';
    }
    
    document.getElementById('practice-feedback').innerHTML = `<p>${feedback}</p>`;
}

// Manejo de redimensionamiento de ventana
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Función para capturar pantalla
function takeScreenshot() {
    if (renderer) {
        renderer.render(scene, camera);
        const dataURL = renderer.domElement.toDataURL('image/png');
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.download = 'screenshot-3d.png';
        link.href = dataURL;
        link.click();
    }
}

// Función para modo pantalla completa
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Exportar funciones para uso global
window.takeScreenshot = takeScreenshot;
window.toggleFullscreen = toggleFullscreen;

