#include<bits/stdc++.h>
#include <fstream>
using namespace std;
#include <iomanip> // Add this at the top
#include <nlohmann/json.hpp>

using json = nlohmann::json;

vector<pair<string,vector<int>>> valid_words;
vector<string> all_words;

int main(int argc, char* argv[]) {
    cout << "Solver called\n";

    ifstream inFile;
    inFile.open("../components/wordle-bank.txt");
    if (!inFile) {
        cerr << "Unable to open wordle-bank";
        exit(1);
    }

    while(inFile >> s) {
        vector<int> v(26);
        for (auto a : s) {
            v[a-'a']++;
        }
        valid_words.push_back(make_pair(s,v));
    }

    ifstream inFile2;
    inFile2.open("../components/valid-words.txt");
    if (!inFile2) {
        cerr << "Unable to open wordle-bank";
        exit(1);
    }
    while(inFile2 >> s) {
        all_words.push_back(s);
    }

    string jsonString;
    cin >> jsonString;
    json jsonData = json::parse(jsonString);

    cout << jsonString << "\n";
}