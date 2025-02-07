#include<bits/stdc++.h>
#include <fstream>
#include <iomanip> // Add this at the top
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace std::chrono;
using namespace std;

const int max_count = 2318;
int word_count;

vector<string> valid_words;
vector<string> all_words;
vector<vector<bitset<max_count>>> word_breakdowns(5, vector<bitset<max_count>>(26,0));

bitset<max_count> full_bitset(0);

vector<pair<string, double>> scores;


void Initialise() {
    string s;
    ifstream inFile1;

    inFile1.open("./src/components/valid-words.txt");
    if (!inFile1) {
        cout << "Unable to open valid-words";
        exit(1);
    }
    while(inFile1 >> s) all_words.push_back(s);

    // ifstream inFile2;
    // inFile2.open("../components/wordle-bank.txt");
    // if (!inFile2) {
    //     cout << "Unable to open valid-words";
    //     exit(1);
    // }
    // while(inFile2 >> s) valid_words.push_back(s);

    for (int i = 0; i < valid_words.size(); i++) full_bitset[i] = 1; 

    for (int index = 0; index < valid_words.size(); index++) {
        string str = valid_words[index];
        for (int i = 0; i < 5; i++) {
            (word_breakdowns[i][str[i]-'a'])[index] = 1;
        }
    }
}

void doSolve(int index, string str, unordered_map<string,int> &outcomes, bitset<max_count> bits, string cnt, vector<bool> ignore) {
    // If no words can be formed, return
    if (bits.none()) return;

    // If reached the last letter, add to outcomes
    if (index == 5) {
        outcomes[cnt] += bits.count();
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
    // For each guess, calculate how "good" it is.
    for (int i = 0; i < all_words_count; i++) {
        unordered_map<string, int> outcomes;
        vector<bool> ignore(5, false);
        string str = all_words[i];
        doSolve(0, str, outcomes, full_bitset, "", ignore);

        double score = 0, n = valid_words.size();
        for (auto a : outcomes) {
            double p = a.second;
            score += (p/n) * (log2(p));
        }
        scores.push_back(make_pair(str, score));
    }

    // sort by score and return
    sort(scores.begin(), scores.end(), [](pair<string,double> p1, pair<string,double> p2) {
        return p1.second < p2.second;
    });

    scores.resize(10);

    json ret_json = json::array();
    for (int i = 0; i < 10 ; i++) {
        ret_json.push_back({{"word", scores[i].first}, {"score", scores[i].second}});
    }
    cout << ret_json.dump() << '\n';
}

int main(int argc, char* argv[]) {
    auto start = high_resolution_clock::now();
    string jsonString;
    cin >> jsonString;
    json jsonData = json::parse(jsonString);
    for (auto a : jsonData) {
        valid_words.push_back(a);
    }
    if (valid_words.size() == 0) {
        return 0;
    }
    if (valid_words.size() == 1) {
        json ret_json = json::array();
        ret_json.push_back({{"word", valid_words[0]}, {"score", -1}});
        cout << ret_json.dump() << '\n';
        return 0;
    }
    if (valid_words.size() == 2) {
        json ret_json = json::array();
        ret_json.push_back({{"word", valid_words[0]}, {"score", 0.5}});
        ret_json.push_back({{"word", valid_words[1]}, {"score", 0.5}});
        cout << ret_json.dump() << '\n';
        return 0;
    }
    word_count = valid_words.size();
    Initialise();
    Solve();

    auto stop = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(stop - start);

    // cout << "Time taken: "
    //      << (double)duration.count()/10e2 << " seconds" << endl;

    return 0;
}
