import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-Diary',
  templateUrl: './Diary.page.html',
  styleUrls: ['./Diary.page.scss'],
})
export class DiaryPage implements OnInit {
  dataDiary: any = [];
  id: number | null = null;
  judul: string = '';
  deskripsi: string = '';
  modal_tambah: boolean = false;
  modal_edit: boolean = false;

  constructor(
    private _apiService: ApiService,
    private modal: ModalController,
    private router: Router  // Injeksi Router
  ) {}

  ngOnInit() {
    this.getDiary();
  }

  getDiary() {
    this._apiService.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataDiary = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  reset_model() {
    this.id = null;
    this.judul = '';
    this.deskripsi = '';
  }

  cancel() {
    this.modal.dismiss();
    this.modal_tambah = false;
    this.reset_model();
  }

  open_modal_tambah(isOpen: boolean) {
    this.modal_tambah = isOpen;
    this.reset_model();
    this.modal_tambah = true;
    this.modal_edit = false;
  }

  open_modal_edit(isOpen: boolean, idget: any) {
    this.modal_edit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilDiary(this.id);
    this.modal_tambah = false;
    this.modal_edit = true;
  }

  tambahDiary() {
    if (this.judul != '' && this.deskripsi != '') {
      let data = {
        judul: this.judul,
        deskripsi: this.deskripsi,
      };
      this._apiService.tambah(data, '/tambah.php').subscribe({
        next: (hasil: any) => {
          this.reset_model();
          console.log('berhasil tambah Diary');
          this.getDiary();
          this.modal_tambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah Diary');
        },
      });
    } else {
      console.log('gagal tambah Diary karena masih ada data yg kosong');
    }
  }

  hapusDiary(id: any) {
    this._apiService.hapus(id, '/hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getDiary();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }

  ambilDiary(id: any) {
    this._apiService.lihat(id, '/lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let Diary = hasil;
        this.id = Diary.id;
        this.judul = Diary.judul;
        this.deskripsi = Diary.deskripsi;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }

  editDiary() {
    let data = {
      id: this.id,
      judul: this.judul,
      deskripsi: this.deskripsi,
    };
    this._apiService.edit(data, 'edit.php').subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.reset_model();
        this.getDiary();
        console.log('berhasil edit Diary');
        this.modal_edit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Diary ' + err.message);
      },
    });
  }

  logout() {
    // Lakukan proses logout seperti membersihkan token atau sesi yang ada
    // Misalnya, menghapus token dari localStorage
    localStorage.removeItem('token-saya');
    localStorage.removeItem('namasaya');

    // Redirect ke halaman login
    this.router.navigate(['/login']);
  }
}
