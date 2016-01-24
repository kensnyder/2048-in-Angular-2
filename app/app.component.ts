import {Component} from 'angular2/core';

@Component({
    selector: 'my-app',
    template: `
    <button (click)="restart()">Restart</button>
    <table>
        <tr *ngFor="#rows of board; #row = index">
            <td *ngFor="#n of rows; #col = index"
                [class.new]="newest==''+row+col"
                [style.backgroundColor]="getBgColor(n)"
                [style.color]="getFgColor(n)"
                >
                <div [style.transform]="getTransform(n)">
                    {{n || ''}}
                </div>
            </td>
        </tr>
    </table>
    `,
})
export class AppComponent {

    constructor() {
        this.restart();
        document.addEventListener('keydown', (evt) => {
           switch (evt.which) {
               case 37: return this.left();
               case 38: return this.up();
               case 39: return this.right();
               case 40: return this.down();
           }
        });
    }

    getTransform(n) {
        switch (String(n).length) {
            case 1:
            case 2: return 'none';
            case 3: return 'scale(0.9)';
            case 4: return 'scale(0.8)';
            default: return 'scale(0.7)';
        }
    }

    getFgColor(n) {
        if (n <= 4) {
            return '#635B52';
        }
        return '#fff';
    }

    getBgColor(n) {
        let lookup = {
            '0': '#C2B4A5',
            '2': '#EADED2',
            '4': '#E9DABC',
            '8': '#EDA065',
            '16': '#F18151',
            '32': '#F1654D',
            '64': '#F1462D',
            '128': '#E8C65F',
            '256': '#E8C34F',
            '512': '#E8BB31',
            '1024': '#E8BB31',
            '2048': '#E8B724',
            '4096': '#FC222D',
            '8192': '#FC0018',
        };
        return lookup[n] || '#333';
    }

    restart() {
        this.board = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ];
        this.addRandom();
        this.addRandom();
    }

    random() {
        return Math.floor(Math.random() * 16);
    }

    addRandom() {
        let start, row, col;
        start = this.random();
        row = Math.floor(start / 4);
        col = start % 4;
        if (this.board[row][col]) {
            return this.addRandom();
        }
        this.newest = '' + row + col;
        this.board[row][col] = (Math.random() >= 0.75 ? 4 : 2);
        setTimeout(() => this.newest = '', 100);
    }

    slide(...row) {
        let newRow;
        let noZeros = this.noZeros(row);
        let a = noZeros[0] || 0;
        let b = noZeros[1] || 0;
        let c = noZeros[2] || 0;
        let d = noZeros[3] || 0;
        if (a == b && b != c && c == d) {
            console.log('aabb', a, b, c, d);
            newRow = [2 * a, 2 * c, 0, 0];
        }
        else if (a != b && b == c) {
            console.log('abb*', a, b, c, d);
            newRow = [a, 2 * b, d, 0];
        }
        else if (a != b && b != c && c != d) {
            console.log('abcd', a, b, c, d);
            newRow = noZeros.concat([0,0,0,0]).slice(0, 4);
        }
        else if (a == b && b == c && c == d) {
            console.log('aaaa', a, b, c, d);
            newRow = [2 * a, 2 * a, 0, 0];
        }
        else if (a == b && b == c && c != d) {
            console.log('aaab', a, b, c, d);
            newRow = [2 * a, c, d, 0];
        }
        else if (a != b && b == c && c == d) {
            console.log('abbb', a, b, c, d);
            newRow = [a, 2 * b, d, 0];
        }
        else if (a != b && b != c && c == d) {
            console.log('abcc', a, b, c, d);
            newRow = [a, b, 2 * c, 0];
        }
        else if (a == b && b != c && c != d) {
            console.log('aabc', a, b, c, d);
            newRow = [2 * a, c, d, 0];
        }
        else {
            console.log('another case!', [a,b,c,d]);
            newRow = row;
        }
        return newRow;
    }

    noZeros(list) {
        let newList = [];
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i] > 0) {
                newList.push(list[i]);
            }
        }
        return newList.concat([0,0,0,0]).slice(0, 4);
    }

    left() {
        let oldBoard = JSON.stringify(this.board);
        this.board = [
            this.slide(this.board[0][0], this.board[0][1], this.board[0][2], this.board[0][3]),
            this.slide(this.board[1][0], this.board[1][1], this.board[1][2], this.board[1][3]),
            this.slide(this.board[2][0], this.board[2][1], this.board[2][2], this.board[2][3]),
            this.slide(this.board[3][0], this.board[3][1], this.board[3][2], this.board[3][3]),
        ];
        if (oldBoard == JSON.stringify(this.board)) {
            console.log('not a valid move!');
            return;
        }
        this.newest = '';
        setTimeout(this.addRandom.bind(this), 300);
    }

    up() {
        let oldBoard = JSON.stringify(this.board);
        this.board = this.rotateCcw90(this.board);
        this.board = this.rotateCw90([
            this.slide(this.board[0][0], this.board[0][1], this.board[0][2], this.board[0][3]),
            this.slide(this.board[1][0], this.board[1][1], this.board[1][2], this.board[1][3]),
            this.slide(this.board[2][0], this.board[2][1], this.board[2][2], this.board[2][3]),
            this.slide(this.board[3][0], this.board[3][1], this.board[3][2], this.board[3][3]),
        ]);
        if (oldBoard == JSON.stringify(this.board)) {
            console.log('not a valid move!');
            return;
        }
        this.newest = '';
        setTimeout(this.addRandom.bind(this), 300);
    }

    right() {
        let oldBoard = JSON.stringify(this.board);
        this.board = this.rotate180(this.board);
        this.board = this.rotate180([
            this.slide(this.board[0][0], this.board[0][1], this.board[0][2], this.board[0][3]),
            this.slide(this.board[1][0], this.board[1][1], this.board[1][2], this.board[1][3]),
            this.slide(this.board[2][0], this.board[2][1], this.board[2][2], this.board[2][3]),
            this.slide(this.board[3][0], this.board[3][1], this.board[3][2], this.board[3][3]),
        ]);
        if (oldBoard == JSON.stringify(this.board)) {
            console.log('not a valid move!');
            return;
        }
        this.newest = '';
        setTimeout(this.addRandom.bind(this), 300);
    }

    down() {
        let oldBoard = JSON.stringify(this.board);
        this.board = this.rotateCw90(this.board);
        this.board = this.rotateCcw90([
            this.slide(this.board[0][0], this.board[0][1], this.board[0][2], this.board[0][3]),
            this.slide(this.board[1][0], this.board[1][1], this.board[1][2], this.board[1][3]),
            this.slide(this.board[2][0], this.board[2][1], this.board[2][2], this.board[2][3]),
            this.slide(this.board[3][0], this.board[3][1], this.board[3][2], this.board[3][3]),
        ]);
        if (oldBoard == JSON.stringify(this.board)) {
            console.log('not a valid move!');
            return;
        }
        this.newest = '';
        setTimeout(this.addRandom.bind(this), 300);
    }

    rotateCw90(b) {
        return [
            [ b[3][0], b[2][0], b[1][0], b[0][0] ],
            [ b[3][1], b[2][1], b[1][1], b[0][1] ],
            [ b[3][2], b[2][2], b[1][2], b[0][2] ],
            [ b[3][3], b[2][3], b[1][3], b[0][3] ],
        ];
    }

    rotateCcw90(b) {
        return [
            [ b[0][3], b[1][3], b[2][3], b[3][3] ],
            [ b[0][2], b[1][2], b[2][2], b[3][2] ],
            [ b[0][1], b[1][1], b[2][1], b[3][1] ],
            [ b[0][0], b[1][0], b[2][0], b[3][0] ],
        ];
    }

    rotate180(b) {
        return [
            [ b[0][3], b[0][2], b[0][1], b[0][0] ],
            [ b[1][3], b[1][2], b[1][1], b[1][0] ],
            [ b[2][3], b[2][2], b[2][1], b[2][0] ],
            [ b[3][3], b[3][2], b[3][1], b[3][0] ],
        ];
    }

}