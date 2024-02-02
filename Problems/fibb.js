class Solution {
    static my_fibonacci(param_1) {
      if (param_1 < 0) {
        return -1;
        }
      if (param_1 == 0) {
        return 0;
        }
      if (param_1 == 1) {
        return 1;
        }
      let fibPrev = 0;
      let fibCurr = 1;
      
      for (let i = 2; i <= param_1; i++) {
        let fibNext = fibCurr + fibPrev;
        fibPrev = fibCurr;
        fibCurr = fibNext;
        console.log("i:", i);
        console.log("fibCurr: ", fibCurr);
        }
        return fibCurr;
    }
}
  
// 0 1 1 2 3 5 
console.log(Solution.my_fibonacci(6));
/*
0
1
1
1+1 = 2


*/