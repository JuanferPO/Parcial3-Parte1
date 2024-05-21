<!-- Componente principal donde se utiliza CrudButtonComponent -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Carro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-modal :is-open="modalIsOpen" @didDismiss="modalIsOpen = false" :css-class="['my-custom-modal']">
        <div id="modal-content">
          <div id="data-form">
            <InputComponent v-model="marca" id="marca" name="marca" label="Marca: " />
            <InputComponent v-model="modelo" id="modelo" name="modelo" label="Modelo: " />
            <InputComponent v-model="color" id="color" name="color" label="Color: " />
            <InputComponent v-model="placa" id="placa" name="placa" label="Placa: " />
            <InputComponent type="number" v-model="categoriaId" id="categoriaId" name="Id de categoría: "  label="Id de la categoria: " />
            <InputComponent type="number" v-model="usuarioId" id="usuarioId" name="Id de usuario: " label="Id del usuario: " />
          </div>
          <div>
            <ButtonComponent v-if="showCreated" id="created" value="Agregar" expand="full" color="warning" nameMethod="createRecord"
              @click="createRecord" />
            <ButtonComponent v-if="showUpdated" id="updated" value="Modificar" expand="full" color="warning" nameMethod="updateRecord"
              @click="updateRecord" />
          </div>
        </div>
      </ion-modal>
      <ion-list>
        <ion-item>
          <ion-grid>
            <ion-row>
              <ion-col size="2">Marca</ion-col>
              <ion-col>Modelo</ion-col>
              <ion-col size="1">Color</ion-col>
              <ion-col size="1">Placa</ion-col>
              <ion-col size="2">Categoría</ion-col>
              <ion-col size="2">Usuario</ion-col>
              <ion-col size="2">Acciones</ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <ion-item v-for="(item, index) in items" :key="index">
          <ion-label>
            <ion-grid>
              <ion-row>
                <ion-col size="2">{{item.marca}}</ion-col>
                <ion-col>{{item.modelo}}</ion-col>
                <ion-col size="1">{{item.color}}</ion-col>
                <ion-col size="1">{{item.placa}}</ion-col>
                <ion-col size="2">{{item.categoriaId.nombre}}</ion-col>
                <ion-col size="2">{{item.usuarioId.personaId.nombre}}</ion-col>
                <ion-col size="2">
                  <ion-button @click="fetchRecordById(item.id)">
                    <ion-icon :icon="IonIcons.createOutline"></ion-icon>
                  </ion-button>
                  <ion-button @click="deleteRecordPhysical(item.id)">
                    <ion-icon :icon="IonIcons.trash"></ion-icon>
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-button @click="openModalAdd">
        <ion-icon :icon="IonIcons.addSharp"></ion-icon>
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonModal, IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue';
import InputComponent from '@/components/InputComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import * as IonIcons from 'ionicons/icons';
import axios from 'axios';
import { onMounted, ref } from 'vue';


// Rutas de la API
const baseURL = 'http://localhost:9000/api/carro';

const modalIsOpen = ref(false);
const items = ref<Array<ItemType>>([]);
const id = ref('');
const marca = ref('');
const modelo = ref('');
const color = ref('');
const placa = ref('');
const categoriaId = ref('');
const usuarioId = ref('');

const showCreated = ref<boolean>(true);
const showUpdated = ref<boolean>(false);

// Definir las propiedades que controlarán la visibilidad de los botones
const props = defineProps({
  showCreated: { type: Boolean, default: true },
  showUpdated: { type: Boolean, default: false },
});

// Tipos
interface ItemType {
  id: string;
  marca: string;
  nombre: string;
  modelo: string;
  color: string;
  placa: string;
  categoriaId: number;
  usuarioId: number;
}

onMounted(() => {
  findAllRecords();
});

// Métodos para interactuar con la API
// Obtener todos los registros
async function findAllRecords() {
  try {
    const response = await axios.get(baseURL);
    items.value = response.data;
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los registros:', error);
    throw error;
  }
}

// Obtener por ID
async function fetchRecordById(recordId: string) {
  try {
    await openModalAdd();
    const response = await axios.get(`${baseURL}/${recordId}`);
    const data = response.data;
    id.value = data.id;
    marca.value=data.marca;
    modelo.value=data.modelo;
    color.value=data.color;
    placa.value=data.placa;
    categoriaId.value=data.categoria.id;
    usuarioId.value=data.usuario.id;
    showCreated.value = false;
    showUpdated.value = true;
    return response.data;
  } catch (error) {
    console.error('Error al obtener el registro por ID:', error);
    throw error;
  }
}

// Crear registro
async function createRecord() {
  const data = {
    marca: marca.value,
    modelo: modelo.value,
    color: color.value,
    placa: placa.value,
    categoriaId: {
      id:categoriaId.value
    },
    usuarioId: {
      id:usuarioId.value
    }
  };

  try {
    const response = await axios.post(baseURL, data);
    console.log('Registro creado exitosamente:', response.data);
    await findAllRecords();
    await clearData();
    await closeModal();
  } catch (error) {
    console.error('Error al crear el registro:', error);
  }
}


// Actualizar registro
async function updateRecord() {
  const data = {
    id: id.value,
    marca: marca.value,
    modelo: modelo.value,
    color: color.value,
    placa: placa.value,
    categoriaId: {id:categoriaId.value},
    usuarioId: {id:usuarioId.value}
  };
  try {
    const response = await axios.put(`${baseURL}/${data.id}`, data);
    await closeModal();
    await findAllRecords();
    await clearData();

    showCreated.value = true;
    showUpdated.value = false;

    return response.data;
  } catch (error) {
    console.error('Error al actualizar el registro:', error);
    throw error;
  }
}

// Eliminar registro físico
async function deleteRecordPhysical(id: string) {
  try {
    const response = await axios.delete(`${baseURL}/${id}`);
    await findAllRecords();
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el registro físico:', error);
    throw error;
  }
}

// Eliminado lógico
async function deleteRecordLogical(id) {
  try {
    const response = await axios.put(`${baseURL}/delete-logical/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al realizar el eliminado lógico:', error);
    throw error;
  }
}

async function clearData() {
    marca.value='';
    modelo.value='';
    color.value='';
    placa.value='';
    categoriaId.value='';
    usuarioId.value='';
}

const openModalAdd = () => {
  modalIsOpen.value = true;
};

const closeModal = () => {
  modalIsOpen.value = false;
};

</script>

<style scoped src="../theme/container.css"></style>
