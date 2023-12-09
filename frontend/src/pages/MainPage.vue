<template>
  <q-page padding>
    <q-table
      class="q-pa-md"
      title="List of employees"
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      :pagination="paginations"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props"> {{ props.row.id }}</q-td>
          <q-td key="fullname" :props="props"> {{ props.row.fullname }}</q-td>
          <q-td key="salary" :props="props"> {{ props.row.salary }}</q-td>
          <q-td key="position" :props="props"> {{ props.row.position }}</q-td>
          <q-td key="action" :props="props">
            {{ props.row.action }}
            <q-btn
              color="primary"
              flat
              round
              icon="edit"
              @click="editRecord(props.row)"
            />
            <q-btn
              color="primary"
              flat
              round
              icon="delete"
              @click="deleteRecord(props.row)"
            />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <div class="flex q-gutter-md">
          <q-btn
            type="submit"
            label="Add"
            color="primary"
            @click="addDialog()"
          ></q-btn>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
    </q-table>

    <!-- Add Dialog -->
    <q-dialog v-model="form_add" persistent>
      <q-card>
        <q-card-section align="left">
          <div class="text-h6">Add employee</div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-input
            v-model="fullname"
            outlined
            label="Fullname"
            placeholder="Enter Fullname"
            type="text"
            lazy-rules
            :rules="[requiredValidate]"
          />
          <q-input
            v-model="salary"
            outlined
            type="number"
            label="Salary"
            placeholder="Enter Salary"
            lazy-rules
            :rules="[requiredValidate]"
          />
          <q-input
            v-model="position"
            outlined
            label="Position"
            placeholder="Enter Position"
            lazy-rules
            :rules="[requiredValidate]"
            type="text"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="onCancelAdd()"
          />
          <q-btn
            flat
            label="Add"
            color="primary"
            v-close-popup
            @click="onAdd()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="form_edit" persistent>
      <q-card>
        <q-card-section align="left">
          <div class="text-h6">Edit employee ID: {{ input.id }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-input
            v-model="input.fullname"
            outlined
            label="Fullname"
            placeholder="Enter Fullname"
            type="text"
            lazy-rules
            :rules="[requiredValidate]"
          />
          <q-input
            v-model="input.salary"
            outlined
            type="number"
            label="Salary"
            placeholder="Enter Salary"
            lazy-rules
            :rules="[requiredValidate]"
          />
          <q-input
            v-model="input.position"
            outlined
            label="Position"
            placeholder="Enter Position"
            lazy-rules
            :rules="[requiredValidate]"
            type="text"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="onCancelEdit()"
          />
          <q-btn
            flat
            label="Edit"
            color="primary"
            v-close-popup
            @click="onEdit()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="form_delete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Delete employee ID: {{ input.id }}</span>
        </q-card-section>

        <q-card-section>
          <span class="q-ml-sm">Fullname: {{ input.fullname }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="NO" color="primary" v-close-popup />
          <q-btn
            flat
            label="YES"
            color="primary"
            v-close-popup
            @click="onDelete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <DialogComponent
      v-model="showDialog"
      :propDialog="dialog"
    ></DialogComponent>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import DialogComponent from "src/components/DialogComponent.vue";
import { Notify } from "quasar";
import { requiredValidate } from "../utils/validations";
export default defineComponent({
  name: "MainPage",
  data() {
    return {
      rows: [],
      // All columns include: id, fullname, salary, position
      columns: [
        {
          name: "id",
          label: "ID",
          field: "id",
          align: "left",
        },
        {
          name: "fullname",
          label: "Fullname",
          field: "fullname",
          align: "center",
        },
        {
          name: "salary",
          label: "Salary",
          field: "salary",
          align: "center",
        },
        {
          name: "position",
          label: "Position",
          field: "position",
          align: "center",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "center",
        },
      ],
      fullname: null,
      salary: null,
      position: null,
      form_add: false,
      form_edit: false,
      form_delete: false,
      filter: "",
      paginations: { rowsPerPage: 10 },
      showDialog: false,
      dialog: {
        icon: "",
        msg: "",
        btnType: "",
        iconColor: "primary",
      },
    };
  },
  methods: {
    requiredValidate,
    fetchEmployee() {
      this.$api
        .get("/employee")
        .then((res) => {
          if (res.status == 200) {
            this.rows = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
          Notify.create({
            type: "negative",
            message: "Cannot get all employee!",
          });
        });
    },
    addDialog() {
      this.form_add = true;
    },
    onCancelAdd() {
      this.fullname = null;
      this.salary = null;
      this.position = null;
      this.form_add = false;
      this.fetchEmployee();
    },
    onAdd() {
      if (!this.fullname || !this.salary || !this.position) {
        Notify.create({
          type: "negative",
          message: "Please fill in all fields before adding an employee.",
        });
        this.fullname = null;
        this.salary = null;
        this.position = null;
        return;
      }
      const data = {
        fullname: this.fullname,
        salary: this.salary,
        position: this.position,
      };
      this.$api
        .post("/employee/add", data)
        .then((res) => {
          if (res.status === 200 || 201) {
            Notify.create({
              type: "positive",
              message: "Employee added successfully!",
            });
          } else {
            Notify.create({
              type: "negative",
              message: "Failed to add employee. Please try again.",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          Notify.create({
            type: "negative",
            message: "An error occurred while adding the employee.",
          });
        })
        .finally(() => {
          this.fullname = null;
          this.salary = null;
          this.position = null;
          this.form_add = false;
          this.fetchEmployee();
        });
    },
    editRecord(record) {
      this.input = record;
      this.form_edit = true;
    },
    onCancelEdit() {
      this.fetchEmployee();
    },
    onEdit() {
      if (!this.input.fullname || !this.input.salary || !this.input.position) {
        Notify.create({
          type: "negative",
          message: "Please fill in all fields before updating the employee.",
        });
        this.fetchEmployee();
        return;
      }
      const data = {
        fullname: this.input.fullname,
        salary: this.input.salary,
        position: this.input.position,
      };
      const employeeId = this.input.id;
      this.$api
        .put(`/employee/${employeeId}`, data)
        .then((res) => {
          if (res.status === 200) {
            Notify.create({
              type: "positive",
              message: `Employee ID ${employeeId} updated successfully!`,
            });
          } else {
            Notify.create({
              type: "negative",
              message: "Failed to update employee. Please try again.",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          Notify.create({
            type: "negative",
            message: "An error occurred while updating the employee.",
          });
        })
        .finally(() => {
          this.input = {};
          this.form_edit = false;
          this.fetchEmployee();
        });
    },
    deleteRecord(record) {
      this.input = record;
      this.form_delete = true;
    },
    onDelete() {
      const employeeId = this.input.id;
      this.$api
        .delete(`/employee/${employeeId}`)
        .then((res) => {
          if (res.status === 200) {
            Notify.create({
              type: "positive",
              message: `Employee ID ${employeeId} deleted successfully!`,
            });
          } else {
            Notify.create({
              type: "negative",
              message: "Failed to delete employee. Please try again.",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          Notify.create({
            type: "negative",
            message: "An error occurred while deleting the employee.",
          });
        })
        .finally(() => {
          this.input = {};
          this.form_delete = false;
          this.fetchEmployee();
        });
    },
    applyFilter(row) {
      return (
        this.filter === "" ||
        row.position.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
  },
  computed: {
    filteredRows() {
      return this.rows.filter((row) => this.applyFilter(row));
    },
  },
  async mounted() {
    await this.fetchEmployee();
  },
  components: { DialogComponent },
});
</script>

<style>
</style>