import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  username = '';
  password = '';
  status = '';
  message = '';
  connectionStatus = 'DISCONNECTED';

  private socket!: WebSocket;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.connectWebSocket();
  }

  connectWebSocket() {
    this.socket = new WebSocket('ws://localhost:8080/ws');

    this.socket.onopen = () => {
      this.connectionStatus = 'CONNECTED';
      this.showToast('WebSocket connected', 'success');
    };

    this.socket.onmessage = (event) => {
      const res = JSON.parse(event.data);
      this.status = res.status;
      this.message = res.message;

      this.showToast(res.message, res.status === 'SUCCESS' ? 'success' : 'error');
    };

    this.socket.onerror = () => {
      this.connectionStatus = 'ERROR';
      this.showToast('WebSocket error', 'error');
    };

    this.socket.onclose = () => {
      this.connectionStatus = 'CLOSED';
      this.showToast('WebSocket closed', 'error');
    };
  }

  login() {
    if (!this.username || !this.password) {
      this.showToast('Please enter username and password', 'error');
      return;
    }

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        action: 'login',
        loginId: this.username,
        password: this.password
      }));
    } else {
      this.showToast('WebSocket not connected', 'error');
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['toast-success'] : ['toast-error']
    });
  }

save() {
  if (!this.username || !this.password) {
    this.showToast('Please enter username and password', 'error');
    return;
  }

  if (this.socket.readyState === WebSocket.OPEN) {
    this.socket.send(JSON.stringify({
      action: 'save',
      loginId: this.username,
      password: this.password
    }));
  } else {
    this.showToast('WebSocket not connected', 'error');
  }
}


}


