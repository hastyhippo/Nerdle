#include<bits/stdc++.h>
#include <fstream>
using namespace std;
#include <iomanip> // Add this at the top
#include <nlohmann/json.hpp>

using json = nlohmann::json;

const int max_count = 2318;
int word_count;

vector<string> valid_words;
vector<string> all_words;
vector<vector<bitset<max_count>>> word_breakdowns(5, vector<bitset<max_count>>(26,0));

bitset<max_count> full_bitset(0);


    // ifstream inFile1;

    // inFile1.open("./src/components/valid-words.txt");
    // if (!inFile1) {
    //     cout << "Unable to open valid-words";
    //     exit(1);
    // }
    // while(inFile1 >> s) all_words.push_back(s);


void Initialise() {
    string s;
    ifstream inFile1;
    inFile1.open("../components/valid-words.txt");
    if (!inFile1) {
        cout << "Unable to open valid-words";
        exit(1);
    }
    while(inFile1 >> s) all_words.push_back(s);
    ifstream inFile2;
    inFile2.open("../components/wordle-bank.txt");
    if (!inFile2) {
        cout << "Unable to open valid-words";
        exit(1);
    }
    while(inFile2 >> s) valid_words.push_back(s);

    cout << all_words.size() << " | " << valid_words.size() << "\n";
    for (int i = 0; i < valid_words.size(); i++) full_bitset[i] = 1; 

    for (int index = 0; index < valid_words.size(); index++) {
        string str = valid_words[index];
        for (int i = 0; i < 5; i++) {
            (word_breakdowns[i][str[i]-'a'])[index] = 1;
        }
    }

    // for (int i = 0; i < 5; i++) {
    //     cout << i << ": \n";
    //     for (int j = 0; j < 26;j++) {
    //         cout << (char)(j + 'a') << "\n";
    //         cout << word_breakdowns[i][j] << "\n";
    //         cout << full_bitset << "\n";
    //     }
    // }
}

void doSolve(int index, string str, unordered_map<string,bitset<max_count>> &outcomes, bitset<max_count> bits, string cnt, vector<bool> ignore) {
    if (bits.none()) {
        // If no words can be formed, return
        return;
    }
    if (index == 5) {
        outcomes[cnt] |= bits;
        return;
    }

    // current letter
    char ch = str[index];

    // Set current to green
    doSolve(index + 1, str, outcomes, bits & word_breakdowns[index][ch-'a'], cnt + "2", ignore);
    bits &= ~word_breakdowns[index][ch-'a'];

    // Set current to yellow 
    bitset<max_count> hash(0);
    for (int i = 0; i < 5; i++) {
        //  Make sure the yellow hasn't been accounted for and currently not on a yellow
        if (str[i] != ch && !ignore[i]) {
            hash |= word_breakdowns[i][ch-'a'];
            ignore[i] = true;
            doSolve(index + 1, str, outcomes, bits & word_breakdowns[i][ch-'a'], cnt + "1", ignore);
            ignore[i] = false;
            bits &= ~word_breakdowns[i][ch-'a'];
        }
    }

    // Set current to grey
    doSolve(index+1, str, outcomes, bits & (full_bitset & ~hash), cnt + "0", ignore);
}
void Solve() {
    int all_words_count = all_words.size();
    vector<bool> ignore(5, false);
    unordered_map<string,bitset<max_count>> outcomes;
    // For each guess, calculate how "good" it is.
    // for (int i = 6; i < 7; i++) {
    //     cout << all_words[i] << "\n";
    //     string str = all_words[i];
    // }
        doSolve(0, "podgy", outcomes, full_bitset, "", ignore);

    int sum = 0;
    for (auto a : outcomes) {
        cout << a.first << "\n";
        for (int i = 0; i < max_count; i++) {
            if (a.second[i] == 0) continue;
            cout << valid_words[i] << ' ';
        }
            sum += a.second.count();

        cout << "\n";
    }
    cout << "\nFINAL SUM: " << sum << '\n';
}

int main(int argc, char* argv[]) {
    cout << "Solver called\n";
    // string jsonString;
    // cin >> jsonString;
    // json jsonData = json::parse(jsonString);
    // for (auto a : jsonData) {
    //     valid_words.push_back(a);
    // }
    // word_count = valid_words.size();
    // cout << word_count;
    Initialise();
    Solve();
}
